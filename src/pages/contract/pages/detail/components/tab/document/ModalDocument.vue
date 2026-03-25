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
          hide-error
          required>
          <UploadInput
            v-model="uploadFiles"
            v-model:preview-urls="uploadPreviewUrls" />
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
          <span>: {{ props.item?.documentType ? formatDocumentType(props.item.documentType) : '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">คำอธิบาย</span>
          <span>: {{ props.item?.note || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">จุดจัดเก็บ</span>
          <span>: {{ props.item?.location?.name || '-' }}</span>
        </div>
        <div
          v-if="props.item?.files?.length"
          class="grid gap-2">
          <span class="text-sm font-bold text-gray-700">เอกสาร</span>
          <img
            :src="props.item.files"
            alt="เอกสาร"
            class="w-full rounded-lg object-contain max-h-80">
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
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateDocument } from '@/models/request/contract/ContractReq.model'
import type { IContractDocumentList } from '@/models/response/contract/ContractRes.model'
import { DocumentTypeEnum, formatTitle as formatDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import DocumentTypeSelection from '@/components/selection/modules/document-type/DocumentTypeSelection.vue'
import WarehouseSelection from '@/components/selection/modules/warehouse/WarehouseSelection.vue'
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

const ContractService: IContractProvider = new ContractProvider()
const UploadService: IUploadProvider = new UploadProvider()

const currentMode = ref<TDocumentModalMode>(props.mode)
// const formRead = useInitDetail()
const resolver = zodResolver(DocumentSchema)
const formData = ref<DocumentFormValues>(useFormInitialValues())
const uploadFiles = ref<File[]>([])
const uploadPreviewUrls = ref<string[]>([])

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
    locationId: props.item.location?.id ? Number(props.item.location.id) : undefined,
    files: [],
    note: props.item.note || ''
  }
  uploadFiles.value = []
  uploadPreviewUrls.value = props.item.files ? [props.item.files] : []
}

function onOpen (): void {
  currentMode.value = props.mode
  if (props.mode === 'create') {
    formData.value = useFormInitialValues()
    uploadFiles.value = []
    uploadPreviewUrls.value = []
  } else if (props.mode === 'edit') {
    populateForm()
  }
}

watch((): TDocumentModalMode => props.mode, (val: TDocumentModalMode): void => {
  currentMode.value = val
})

async function uploadAndSetFile (file: File): Promise<void> {
  const response = await UploadService.uploadFile(file)
  formData.value.files = [response.data]
}

watch(uploadFiles, (files: File[]): void => {
  if (files.length === 0) {
    formData.value.files = []
    return
  }
  handleLoading((): Promise<void> => uploadAndSetFile(files[files.length - 1]))
}, { deep: true })

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  const values = {
    documentType: formData.value.documentType,
    locationId: formData.value.locationId,
    files: [], // TODO WHEN CAN UPLOAD
    note: formData.value.note
  } as ICreateDocument
  const itemId = props.item?.id
  handleLoading(async (): Promise<void> => {
    if (currentMode.value === 'create') {
      await ContractService.createDocument(props.contractId, values)
    } else if (currentMode.value === 'edit' && itemId) {
      // await ContractService.updateDocument(props.contractId, itemId, values)
    }
    emits('update')
    close()
  })
}

function onDelete (close: () => void): void {
  const id = props.item?.id
  if (!id) return
  handleLoading(async (): Promise<void> => {
    await ContractService.deleteDocument(props.contractId, id)
    emits('update')
    close()
  })
}
</script>
