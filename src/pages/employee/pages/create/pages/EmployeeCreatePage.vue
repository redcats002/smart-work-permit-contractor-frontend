<template>
  <section id="employee-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <DevButton
        @click="onAuto()" />
      <ReadIdentificationCardButton />
    </BaseTop>
    <BasePage class="flex flex-col md:grid md:grid-cols-3 gap-4">
      <BaseContainer class="h-fit md:order-2 md:col-span-1">
        <UploadInput
          v-model="media"
          :model-image="form.image"
          :single="true"
          button-upload-class="bg-primary text-white"
          detail="ไฟล์ JPG, JPEG และ PNG ได้รับอนุญาต"
          label="เลือกเพื่ออัปโหลดหรือลากและวาง"
          hide-icon-button />
      </BaseContainer>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 col-span-2"
        @submit="onSubmit($event)">
        <BaseContainer>
          <InformationForm
            v-model="form"
            v-model:form-key="formKey"
            :form="$form" />
        </BaseContainer>
        <BaseContainer>
          <AddressForm
            v-model="mainAddress"
            :form="$form"
            type="MAIN" />
        </BaseContainer>
        <BaseContainer>
          <AddressForm
            v-model="currentAddress"
            :citizen-address="mainAddress"
            :form="$form"
            type="CURRENT"
            @use-same-citizen-address="onUseSameCitizenAddress('CURRENT')" />
        </BaseContainer>
        <FormAction @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AddressForm from '@/components/input/AddressForm.vue'
import InformationForm from '../components/InformationForm.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import { type EmployeeFormValues, EmployeeSchema, useDev, useFormInitialValues } from '../schema/employee.schema'

const router = useRouter()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const formKey = ref<number>(0)
const form = ref<EmployeeFormValues>(useFormInitialValues())
const resolver = zodResolver(EmployeeSchema)
const { media, getUploadImages } = useUpload()

const mainAddress = computed({
  get (): IAddressRequest { return form.value.mainAddress },
  set (e: IAddressRequest): void { form.value.mainAddress = e }
})
const currentAddress = computed({
  get (): IAddressRequest { return form.value.currentAddress },
  set (e: IAddressRequest): void { form.value.currentAddress = e }
})

async function useSubmit (): Promise<void> {
  const images = await getUploadImages()
  await EmployeeService.createEmployee(usePayload(form.value, images))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'EmployeeListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors, true)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'EmployeeListPage' })
}


function onUseSameCitizenAddress (type: 'CURRENT' | 'WORK'): void {
  if (type === 'CURRENT') {
    currentAddress.value = {
      ...currentAddress.value,
      isSameCitizenAddress: true,
      isSameCurrentAddress: false,
      address: mainAddress.value.address,
      subDistrict: mainAddress.value.subDistrict,
      district: mainAddress.value.district,
      province: mainAddress.value.province,
      postCode: mainAddress.value.postCode
    }
  }
  mount()
}

function mount (): void {
  formKey.value++
}

function onAuto (): void {
  form.value = { ...useDev() }
  mount()
}

</script>

<style scoped>
:deep(.custom-upload-btn) {
  background-color: var(--color-primary);
  color: white
}
</style>
