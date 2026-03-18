<template>
  <section id="customer-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ConfirmButton
        label="Auto"
        @click="onAuto()" />
      <ReadIdentificationCardButton />
    </BaseTop>
    <BasePage>
      <div>
        <Form
          :key="formKey"
          v-slot="$form"
          :initial-values="form"
          :resolver="resolver"
          class="flex flex-col gap-5"
          @submit="onSubmit($event)">
          <BaseContainer>
            <InformationForm
              v-model="form"
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
              :form="$form"
              type="CURRENT"
              @use-same-citizen-address="onUseSameCitizenAddress('CURRENT')" />
          </BaseContainer>
          <BaseContainer>
            <AddressForm
              v-model="workAddress"
              :form="$form"
              type="WORK"
              @use-same-citizen-address="onUseSameCitizenAddress('WORK')"
              @use-same-current-address="onUseSameCurrentAddress('WORK')" />
          </BaseContainer>
          <FormAction @cancel="onCancel()" />
        </Form>
      </div>
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
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AddressForm from '../components/AddressForm.vue'
import InformationForm from '../components/InformationForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import { type CustomerFormValues, CustomerSchema, useDev, useFormInitialValues } from '../schema/customer.schema'

const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()

const formKey = ref<number>(0)
const form = ref<CustomerFormValues>(useFormInitialValues())
const resolver = zodResolver(CustomerSchema)

const mainAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.mainAddress?.address,
      subDistrict: form.value.mainAddress?.subDistrict,
      district: form.value.mainAddress?.district,
      province: form.value.mainAddress?.province,
      postCode: form.value.mainAddress?.postCode
    }
  },
  set (e: IAddressRequest): void {
    form.value.mainAddress.address = e.address
    form.value.mainAddress.subDistrict = e.subDistrict
    form.value.mainAddress.district = e.district
    form.value.mainAddress.province = e.province
    form.value.mainAddress.postCode = e.postCode
  }
})
const currentAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.currentAddress?.address,
      subDistrict: form.value.currentAddress?.subDistrict,
      district: form.value.currentAddress?.district,
      province: form.value.currentAddress?.province,
      postCode: form.value.currentAddress?.postCode,
      isSameCitizenAddress: form.value.currentAddress?.isSameCitizenAddress,
      urlGoogleMap: form.value.currentAddress?.urlGoogleMap
    }
  },
  set (e: IAddressRequest): void {
    form.value.currentAddress.address = e.address
    form.value.currentAddress.subDistrict = e.subDistrict
    form.value.currentAddress.district = e.district
    form.value.currentAddress.province = e.province
    form.value.currentAddress.postCode = e.postCode
    form.value.currentAddress.isSameCitizenAddress = e.isSameCitizenAddress
    form.value.currentAddress.urlGoogleMap = e.urlGoogleMap
  }
})
const workAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.workAddress.address,
      subDistrict: form.value.workAddress.subDistrict,
      district: form.value.workAddress.district,
      province: form.value.workAddress.province,
      postCode: form.value.workAddress.postCode,
      isSameCitizenAddress: form.value.workAddress.isSameCitizenAddress,
      isSameCurrentAddress: form.value.workAddress.isSameCurrentAddress,
      urlGoogleMap: form.value.workAddress.urlGoogleMap
    }
  },
  set (e: IAddressRequest): void {
    form.value.workAddress.address = e.address
    form.value.workAddress.subDistrict = e.subDistrict
    form.value.workAddress.district = e.district
    form.value.workAddress.province = e.province
    form.value.workAddress.postCode = e.postCode
    form.value.workAddress.isSameCitizenAddress = e.isSameCitizenAddress
    form.value.workAddress.isSameCurrentAddress = e.isSameCurrentAddress
    form.value.workAddress.urlGoogleMap = e.urlGoogleMap
  }
})

async function useSubmit (): Promise<void> {
  await CustomerService.createCustomer(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'CustomerListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'CustomerListPage' })
}

function onAuto (): void {
  form.value = { ...useDev() }
  // Remount <Form> so it picks up the new initial-values without stale error state
  formKey.value++
}

function onUseSameCurrentAddress (type: 'WORK'): void {
  if (type === 'WORK') {
    workAddress.value = {
      ...workAddress.value,
      isSameCurrentAddress: true,
      isSameCitizenAddress: false,
      address: currentAddress.value.address,
      subDistrict: currentAddress.value.subDistrict,
      district: currentAddress.value.district,
      province: currentAddress.value.province,
      postCode: currentAddress.value.postCode
    }
  }
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
  } else if (type === 'WORK') {
    workAddress.value = {
      ...workAddress.value,
      isSameCitizenAddress: true,
      isSameCurrentAddress: false,
      address: mainAddress.value.address,
      subDistrict: mainAddress.value.subDistrict,
      district: mainAddress.value.district,
      province: mainAddress.value.province,
      postCode: mainAddress.value.postCode
    }
  }
}
</script>

<style scoped>

</style>
