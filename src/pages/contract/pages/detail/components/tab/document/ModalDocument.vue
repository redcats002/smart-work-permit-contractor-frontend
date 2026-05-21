<template>
  <BaseModal
    v-model="visible"
    :label="modalLabel"
    :style="{ width: 'min(95vw, 500px)' }"
    @open="onOpen()">
    <template #default="{ close }">
      <!-- FORM MODE: create / edit -->
      <Form
        v-if="isFormMode"
        :key="formKey"
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="ประเภทเอกสาร"
          name="documentType"
          tag="div"
          hide-error
          required>
          <DocumentTypeSelection
            v-model="formData.documentType"
            :invalid="invalid" />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="จุดจัดเก็บ"
          name="locationId"
          tag="div"
          hide-error
          required>
          <WarehouseSelection
            v-model="formData.locationId"
            :invalid="invalid" />
        </LabelField>

        <LabelField
          :form="$form"
          label="แนบเอกสาร"
          name="files"
          tag="div"
          hide-error>
          <UploadInput v-model="media" />
        </LabelField>

        <LabelField
          v-model="formData.note"
          :form="$form"
          label="คำอธิบาย"
          name="note"
          required />

        <FormAction
          class="mt-2"
          @cancel="close()" />
      </Form>

      <!-- READ MODE -->
      <div
        v-else-if="currentMode === 'read'"
        class="grid gap-4">
        <div class="flex justify-end">
          <BaseActionMenu :items="readMenuItems" />
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <span class="font-bold text-gray-700 whitespace-nowrap">ประเภทเอกสาร</span>
          <span>: {{ item?.documentType ? formatDocumentType(item.documentType) : '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">คำอธิบาย</span>
          <span>: {{ item?.note || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">จุดจัดเก็บ</span>
          <span>: {{ item?.location?.name || '-' }}</span>
        </div>
        <div
          v-if="item?.files"
          class="grid gap-2">
          <span class="text-sm font-bold text-gray-700">เอกสาร</span>
          <FileAttachment :files="item.files" />
        </div>
      </div>

      <!-- DELETE MODE -->
      <div
        v-else-if="currentMode === 'delete'"
        class="grid gap-6">
        <div class="flex flex-col items-center justify-center text-sm text-gray-700 gap-1 py-4">
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้</p>
          <p class="text-surface-500">
            หากลบแล้ว ข้อมูลนี้จะถูกลบอย่างถาวรไม่สามารถย้อนกลับได้
          </p>
        </div>
        <FormAction
          confirm-label="ใช่, ฉันต้องการลบ"
          mode="delete"
          @cancel="close()"
          @confirm="onDelete(close)" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateDocument } from '@/models/request/contract-document/ContractDocumentReq.model'
import type { IContractDocumentList } from '@/models/response/contract-document/ContractDocumentRes.model'
import { DocumentTypeEnum, formatTitle as formatDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import ContractDocumentProvider, { type IContractDocumentProvider } from '@/resources/provider/contract-document/ContractDocument.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import FormAction from '@/components/button/FormAction.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import WarehouseSelection from '@/components/selection/modules/api/warehouse/WarehouseSelection.vue'
import DocumentTypeSelection from '@/components/selection/modules/static/document-type/DocumentTypeSelection.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type DocumentFormValues, DocumentSchema, useFormInitialValues } from './schema/document.schema'

export type TDocumentModalMode = 'create' | 'read' | 'edit' | 'delete'

interface IProps {
  mode: TDocumentModalMode
  item?: IContractDocumentList
  contractId: number
}

interface IEmits {
  update: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const ContractDocumentService: IContractDocumentProvider = new ContractDocumentProvider()
const { media, getUploadImages } = useUpload()

const formKey = ref<number>(0)
const currentMode = ref<TDocumentModalMode>(props.mode)
const resolver = zodResolver(DocumentSchema)
const formData = ref<DocumentFormValues>(useFormInitialValues())

const isFormMode = computed((): boolean => currentMode.value === 'create' || currentMode.value === 'edit')

const modalLabel = computed((): string => {
  const labels: Record<TDocumentModalMode, string> = {
    create: 'บันทึกเอกสาร',
    edit: 'แก้ไขเอกสาร',
    read: 'รายละเอียด',
    delete: 'ยืนยันการลบ'
  }
  return labels[currentMode.value]
})

function switchToEdit (): void {
  currentMode.value = 'edit'
  populateForm()
}

function switchToDelete (): void {
  currentMode.value = 'delete'
}

const readMenuItems = computed((): IMenuItemAction[] => [
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: switchToEdit },
  { label: 'ลบ', key: 'delete', type: 'TEXT', action: switchToDelete }
])

function populateForm (): void {
  if (!props.item) return
  formData.value = {
    documentType: props.item.documentType ? DocumentTypeEnum[props.item.documentType] : undefined,
    locationId: props.item.location?.id != null ? Number(props.item.location.id) : undefined,
    files: [],
    note: props.item.note || ''
  }
  media.value = []
  formKey.value++
}

function onOpen (): void {
  currentMode.value = props.mode
  if (props.mode === 'create') {
    formData.value = useFormInitialValues()
    media.value = []
    formKey.value++
    return
  }
  if (props.mode === 'edit') {
    populateForm()
  }
}


function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  const itemId = props.item?.id
  handleLoading(async (): Promise<void> => {
    const uploadedFiles = await getUploadImages(media.value)
    const values = {
      documentType: formData.value.documentType as DocumentTypeEnum,
      locationId: formData.value.locationId as number,
      files: uploadedFiles,
      note: formData.value.note
    } as ICreateDocument
    if (currentMode.value === 'create') {
      await ContractDocumentService.createDocument(props.contractId, values)
      toast.success('บันทึกเอกสารสำเร็จ')
    } else if (currentMode.value === 'edit' && itemId) {
      await ContractDocumentService.updateDocument(itemId, values)
      toast.success('แก้ไขเอกสารสำเร็จ')
    }
    emits('update')
    close()
  })
}

function onDelete (close: () => void): void {
  const id = props.item?.id
  if (!id) return
  handleLoading(async (): Promise<void> => {
    await ContractDocumentService.deleteDocument(id)
    toast.success('ลบเอกสารสำเร็จ')
    emits('update')
    close()
  })
}


watch((): TDocumentModalMode => props.mode, (val: TDocumentModalMode): void => {
  currentMode.value = val
})
</script>
