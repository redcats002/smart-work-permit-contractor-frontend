<template>
  <DeleteModal
    v-model="showDeleteConfirm"
    @confirm="onDeleteConfirm()" />
  <BaseModal
    v-model="visible"
    :label="modalLabel"
    :style="{ width: 'min(95vw, 500px)' }"
    @open="onOpen()">
    <template
      v-if="currentMode==='READ'"
      #menu>
      <div class="flex justify-end">
        <BaseActionMenu :items="readMenuItems" />
      </div>
    </template>
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
            :invalid="invalid"
            name="documentType"
            placeholder="กรุณาเลือกประเภทเอกสาร" />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="คลัง"
          name="warehouseId"
          tag="div"
          hide-error
          required>
          <WarehouseSelection
            v-model="formData.warehouseId"
            :disabled="mode==='UPDATE'"
            :invalid="invalid"
            name="warehouseId"
            placeholder="กรุณาเลือกคลัง" />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="จุดจัดเก็บ"
          name="locationId"
          tag="div"
          hide-error
          required>
          <LocationSelection
            v-model="formData.locationId"
            :disabled="mode==='UPDATE' || !formData.warehouseId"
            :invalid="invalid"
            :warehouse-id="formData.warehouseId"
            name="locationId"
            placeholder="กรุณาเลือกจุดจัดเก็บ" />
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
          placeholder="กรุณากรอกคำอธิบาย"
          required />

        <FormAction
          class="mt-2"
          @cancel="close()" />
      </Form>

      <!-- READ MODE -->
      <div
        v-else-if="currentMode === 'READ'"
        class="grid gap-4">
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
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { TActionMode } from '@/models/Global.model'
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
import DeleteModal from '@/components/modal/DeleteModal.vue'
import LocationSelection from '@/components/selection/modules/api/location/LocationSelection.vue'
import WarehouseSelection from '@/components/selection/modules/api/warehouse/WarehouseSelection.vue'
import DocumentTypeSelection from '@/components/selection/modules/static/document-type/DocumentTypeSelection.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type DocumentFormValues, DocumentSchema, useFormInitialValues } from './schema/document.schema'

export type TDocumentModalMode = TActionMode

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

const isFormMode = computed((): boolean => currentMode.value === 'CREATE' || currentMode.value === 'UPDATE')

const modalLabel = computed((): string => {
  const labels: Record<TDocumentModalMode, string> = {
    CREATE: 'บันทึกเอกสาร',
    UPDATE: 'แก้ไขเอกสาร',
    READ: 'รายละเอียด',
    DELETE: ''
  }
  return labels[currentMode.value]
})

function switchToEdit (): void {
  currentMode.value = 'UPDATE'
  populateForm()
}

function switchToDelete (): void {
  currentMode.value = 'DELETE'
  showDeleteConfirm.value = true
}

const showDeleteConfirm = ref<boolean>(false)

function onDeleteConfirm (): void {
  if (!props.item?.id) return
  handleLoading(async (): Promise<void> => {
    await ContractDocumentService.deleteDocument(props.item!.id)
    toast.success('ลบเอกสารสำเร็จ')
    showDeleteConfirm.value = false
    visible.value = false
    emits('update')
  })
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
  if (props.mode === 'CREATE') {
    formData.value = useFormInitialValues()
    media.value = []
    formKey.value++
    return
  }
  if (props.mode === 'UPDATE') {
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
    if (currentMode.value === 'CREATE') {
      await ContractDocumentService.createDocument(props.contractId, values)
      toast.success('บันทึกเอกสารสำเร็จ')
    } else if (currentMode.value === 'UPDATE' && itemId) {
      await ContractDocumentService.updateDocument(itemId, values)
      toast.success('แก้ไขเอกสารสำเร็จ')
    }
    emits('update')
    close()
  })
}

watch((): TDocumentModalMode => props.mode, (val: TDocumentModalMode): void => {
  currentMode.value = val
})
</script>
