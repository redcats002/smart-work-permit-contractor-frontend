<template>
  <section id="customer-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ReadIdentificationCardButton />
    </BaseTop>
    <BasePage>
      <div>
        <Form
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
              v-model="citizenAddress"
              :form="$form"
              type="MAIN" />
          </BaseContainer>
          <BaseContainer>
            <AddressForm
              v-model="currentAddress"
              :form="$form"
              type="CURRENT" />
          </BaseContainer>
          <BaseContainer>
            <AddressForm
              v-model="workAddress"
              :form="$form"
              type="WORK" />
          </BaseContainer>
          <FormAction @cancel="onCancel()" />
        </Form>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { IActionCustomerPayload, IUpdateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import AddressForm from '../../create/components/AddressForm.vue'
import InformationForm from '../../create/components/InformationForm.vue'
import { CustomerSchema, useFormInitialValues } from '../../create/schema/customer.schema'

const route = useRoute()
const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()

const form = ref<IActionCustomerPayload>(useFormInitialValues() as IActionCustomerPayload)
const resolver = zodResolver(CustomerSchema)

const customerId = computed((): string => route?.params?.id as string ?? '')
const citizenAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.address,
      subDistrict: form.value.subDistrict,
      district: form.value.district,
      province: form.value.province,
      postalCode: form.value.postalCode
    }
  },
  set (e: IAddressRequest): void {
    form.value.address = e.address
    form.value.subDistrict = e.subDistrict
    form.value.district = e.district
    form.value.province = e.province
    form.value.postalCode = e.postalCode
  }
})
const currentAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.currentAddress,
      subDistrict: form.value.currentSubDistrict,
      district: form.value.currentDistrict,
      province: form.value.currentProvince,
      postalCode: form.value.currentPostalCode,
      isSameCitizenAddress: form.value.isSameCitizenAddress,
      urlGoogleMap: form.value.currentUrlMap
    }
  },
  set (e: IAddressRequest): void {
    form.value.currentAddress = e.address
    form.value.currentSubDistrict = e.subDistrict
    form.value.currentDistrict = e.district
    form.value.currentProvince = e.province
    form.value.currentPostalCode = e.postalCode
    form.value.isSameCitizenAddress = e.isSameCitizenAddress
    form.value.currentUrlMap = e.urlGoogleMap
  }
})
const workAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value.workAddress,
      subDistrict: form.value.workSubDistrict,
      district: form.value.workDistrict,
      province: form.value.workProvince,
      postalCode: form.value.workPostalCode,
      isSameCitizenAddress: form.value.isSameCitizenAddress,
      isSameCurrentAddress: form.value.isSameCurrentAddress,
      urlGoogleMap: form.value.workUrlMap
    }
  },
  set (e: IAddressRequest): void {
    form.value.workAddress = e.address
    form.value.workSubDistrict = e.subDistrict
    form.value.workDistrict = e.district
    form.value.workProvince = e.province
    form.value.workPostalCode = e.postalCode
    form.value.isSameCitizenAddress = e.isSameCitizenAddress
    form.value.isSameCurrentAddress = e.isSameCurrentAddress
    form.value.workUrlMap = e.urlGoogleMap
  }
})

function useInitForm (data: ICustomerById): void {
  form.value = {
    ...data,
    customerGroupId: data?.customerGroup?.id || undefined,
    occupationId: data?.occupation?.id || undefined
  }
}

async function useFetch (): Promise<void> {
  const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  useInitForm(data)
}

async function useSubmit (): Promise<void> {
  if (!customerId.value) throw new Error('Customer ID is required')
  await CustomerService.updateCustomer(customerId.value, form.value as IUpdateCustomerPayload)
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

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
