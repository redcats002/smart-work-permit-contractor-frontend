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
          v-slot="{invalid}"
          v-model="formData.name"
          :form="$form"
          label="ประเภทเอกสาร"
          name="name"
          required>
          <CustomerDocumentTypeSelection
            v-model="formData.name"
            :invalid="invalid"
            name="name"
            placeholder="กรุณากรอกประเภทเอกสาร" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="จุดจัดเก็บเอกสาร"
          name="locationId"
          tag="div"
          hide-error
          required>
          <LocationSelection
            v-model="formData.locationId"
            :invalid="invalid"
            name="locationId" />
        </LabelField>

        <LabelField
          :form="$form"
          label="แนบเอกสาร"
          name="image"
          tag="div"
          hide-error
          required>
          <UploadInput
            v-model="media"
            class="border border-dashed border-gray-700 rounded-md"
            detail=""
            icon="material-symbols-light:upload-file-outline"
            icon-class="size-12"
            remove-button-class="text-(--p-gray-4)! border rounded-full border-(--p-gray-4)! p-1"
            remove-icon="solar:trash-bin-2-linear"
            hide-button
            touchable>
            <template #label>
              <span>
                ลากและวางไฟล์ที่นี่ หรือ
                <span class="font-bold underline">เลือกไฟล์</span>
              </span>
            </template>
          </UploadInput>
        </LabelField>
        <FormAction
          class="mt-2"
          @cancel="close()" />
      </Form>

      <!-- READ MODE -->
      <div
        v-else-if="currentMode === 'READ'"
        class="grid gap-4">
        <div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <span class="font-bold text-gray-700 whitespace-nowrap">ชื่อเอกสาร</span>
          <span>: {{ props.item?.name || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">ชื่อไฟล์</span>
          <span>: {{ props.item?.fileName || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">จุดจัดเก็บ</span>
          <span>: {{ props.item?.location?.name || '-' }}</span>
        </div>
        <div v-if="props.item?.image">
          <a
            :href="props.item.image"
            class="text-blue-500 underline text-sm"
            rel="noopener noreferrer"
            target="_blank">
            ดูไฟล์เอกสาร
          </a>
        </div>
      </div>
    </template>
  </BaseModal>
  <DeleteModal
    v-model="deleteVisible"
    @confirm="onDelete()" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { TActionMode } from '@/models/Global.model'
import type { ICustomerDocumentById } from '@/models/response/customer/CustomerRes.model'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import DeleteModal from '@/components/modal/DeleteModal.vue'
import LocationSelection from '@/components/selection/modules/api/location/LocationSelection.vue'
import CustomerDocumentTypeSelection from '@/components/selection/modules/static/customer-document-type/CustomerDocumentTypeSelection.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type PrivateDocumentFormValues, PrivateDocumentSchema, useFormInitialValues } from '../../../schema/private-document.schema'

interface IProps {
  mode: TActionMode
  item?: ICustomerDocumentById
  customerId: number
}

interface IEmits {
  update: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const CustomerService: ICustomerProvider = new CustomerProvider()
const UploadService: IUploadProvider = new UploadProvider()

const currentMode = ref<TActionMode>(props.mode)
const deleteVisible = ref<boolean>(false)
const resolver = zodResolver(PrivateDocumentSchema)
const formKey = ref<number>(0)
const formData = ref<PrivateDocumentFormValues>(useFormInitialValues())
const { media } = useUpload()

const isFormMode = computed((): boolean => currentMode.value === 'CREATE' || currentMode.value === 'UPDATE')

const modalLabel = computed((): string => {
  const labels: Record<TActionMode, string> = {
    CREATE: 'เพิ่มเอกสาร',
    UPDATE: 'แก้ไขเอกสาร',
    READ: 'รายละเอียดเอกสาร',
    DELETE: 'ยืนยันการลบ'
  }
  return labels[currentMode.value]
})


async function useResolveImageUrl (): Promise<string> {
  const lastMedia = media.value[media.value.length - 1]
  if (!lastMedia) return ''
  if (lastMedia.isNew && lastMedia.file) {
    const response = await UploadService.uploadFile(lastMedia.file)
    return response.data.fileUrl
  }
  return lastMedia.url
}

async function useCreate (): Promise<void> {
  const values = formData.value
  const image = await useResolveImageUrl()
  await CustomerService.createCustomerDocument({
    name: values.name,
    fileName: media.value[0]?.file?.name || values.name,
    image,
    locationId: Number(values.locationId),
    customerId: props.customerId
  })
  toast.success('สร้างเอกสารสำเร็จ')
}

async function useUpdate (): Promise<void> {
  const values = formData.value
  const itemId = props.item?.id
  if (!itemId) return
  const image = await useResolveImageUrl()
  await CustomerService.updateCustomerDocument(itemId, {
    name: values.name,
    fileName: media.value[0]?.file?.name || props.item?.fileName || values.name,
    image,
    locationId: Number(values.locationId)
  })
  toast.success('แก้ไขเอกสารสำเร็จ')
}

async function useDelete (): Promise<void> {
  const id = props.item?.id
  if (!id) return
  await CustomerService.deleteCustomerDocument(id)
  deleteVisible.value = false
  visible.value = false
  toast.success('ลบเอกสารสำเร็จ')
}


function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  if (media.value.length === 0) {
    toast.error('กรุณาแนบเอกสาร')
    return
  }
  const action = currentMode.value === 'CREATE' ? useCreate : useUpdate
  handleLoading(async (): Promise<void> => {
    await action()
    emits('update')
    close()
  })
}

function onDelete (): void {
  handleLoading(async (): Promise<void> => {
    await useDelete()
    emits('update')
  })
}

function onInitActionMode (mode: TActionMode): void {
  currentMode.value = mode
  if (mode === 'DELETE') deleteVisible.value = true
}


function onOpen (): void {
  currentMode.value = props.mode
  if (props.mode === 'CREATE') {
    formData.value = useFormInitialValues()
    media.value = []
    formKey.value++
  } else if (props.mode === 'UPDATE') {
    populateForm()
  }
}

function populateForm (): void {
  if (!props.item) return
  formData.value = {
    name: props.item.name || '',
    locationId: props.item.location?.id ? Number(props.item.location.id) : undefined
  }
  const imageUrl = props.item.image || ''
  media.value = imageUrl
    ? [{ name: props.item.fileName || imageUrl, url: imageUrl, path: imageUrl, isNew: false }]
    : []
  formKey.value++
}

watch((): TActionMode => props.mode, (val: TActionMode): void => {
  onInitActionMode(val)
})


</script>
