<template>
  <section id="customer-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <DevButton
        @click="onAuto()" />
      <ReadIdentificationCardButton
        @read-success="onReadIdCard($event)" />
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
          <BaseContainer>
            <AddressForm
              v-model="workAddress"
              :citizen-address="mainAddress"
              :current-address-ref="currentAddress"
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
import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AddressForm from '@/components/input/AddressForm.vue'
import InformationForm from '../components/InformationForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import { mapIdCardToCustomer } from '../composables/useIdCardMapper'
import { type CustomerFormValues, CustomerSchema, useDev, useFormInitialValues } from '../schema/customer.schema'

const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()

const formKey = ref<number>(0)
const form = ref<CustomerFormValues>(useFormInitialValues())
const resolver = zodResolver(CustomerSchema)

const mainAddress = computed({
  get (): IAddressRequest { return form.value.mainAddress },
  set (e: IAddressRequest): void { form.value.mainAddress = e }
})
const currentAddress = computed({
  get (): IAddressRequest { return form.value.currentAddress },
  set (e: IAddressRequest): void { form.value.currentAddress = e }
})
const workAddress = computed({
  get (): IAddressRequest { return form.value.workAddress },
  set (e: IAddressRequest): void { form.value.workAddress = e }
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

async function onReadIdCard (data: IReadIdCardResult): Promise<void> {
  form.value = await mapIdCardToCustomer(data, form.value)
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
