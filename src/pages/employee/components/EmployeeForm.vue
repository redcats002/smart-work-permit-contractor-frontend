<template>
  <BaseContainer class="h-fit md:order-2 md:col-span-1">
    <UploadInput
      v-model="media"
      :model-image="model.image"
      accept="image/*"
      button-upload-class="bg-primary text-white"
      detail="ไฟล์ JPG, JPEG และ PNG ได้รับอนุญาต"
      label="เลือกเพื่ออัปโหลดหรือลากและวาง"
      hide-icon-button
      single>
      <template #placeholderIcon>
        <div class="p-1.5 rounded-lg border border-(--p-gray-5)">
          <div class="bg-(--p-gray-5) rounded-xl">
            <Icon
              class="size-12 text-(--p-gray-4)"
              icon="solar:user-bold" />
          </div>
        </div>
      </template>
    </UploadInput>
  </BaseContainer>
  <div class="flex flex-col gap-4 md:col-span-2">
    <BaseContainer>
      <InformationForm
        v-model="model"
        v-model:form-key="formKey"
        :form="form"
        @mount="mount()" />
    </BaseContainer>
    <BaseContainer>
      <AddressForm
        v-model="mainAddress"
        :form="form"
        type="MAIN"
        @use-same-citizen-address="mount()"
        @use-same-current-address="mount()" />
    </BaseContainer>
    <BaseContainer>
      <AddressForm
        v-model="currentAddress"
        :citizen-address="mainAddress"
        :form="form"
        type="CURRENT"
        @use-same-citizen-address="mount()"
        @use-same-current-address="mount()" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { IMedia } from '@/resources/provider/Upload.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AddressForm from '@/components/input/AddressForm.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import InformationForm from '@/pages/employee/pages/create/components/InformationForm.vue'
import type { EmployeeFormValues } from '@/pages/employee/pages/create/schema/employee.schema'
import { Icon } from '@iconify/vue'

interface IProps {
  form?: IFormState
}

withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<EmployeeFormValues>({ required: true })
const formKey = defineModel<number>('formKey', { required: true })
const media = defineModel<IMedia[]>('media', { required: true })

const mainAddress = computed({
  get (): IAddressRequest { return model.value.mainAddress },
  set (e: IAddressRequest): void { model.value.mainAddress = e }
})
const currentAddress = computed({
  get (): IAddressRequest { return model.value.currentAddress },
  set (e: IAddressRequest): void { model.value.currentAddress = e }
})

function mount (): void {
  formKey.value++
}
</script>

<style scoped>
:deep(.custom-upload-btn) {
  background-color: var(--color-primary);
  color: white
}
</style>
