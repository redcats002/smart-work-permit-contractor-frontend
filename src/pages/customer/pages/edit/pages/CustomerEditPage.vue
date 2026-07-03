<template>
  <section id="customer-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ReadIdentificationCardButton
        v-if="!isCorporate"
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
          <CustomerForm
            v-model="form"
            v-model:form-key="formKey"
            :form="$form"
            disable-personal-type />
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
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import { PersonalTypeEnum } from '@/enums/modules/customer/PersonalType.enum'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerForm from '@/pages/customer/components/CustomerForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { mapIdCardToCustomer } from '../../create/composables/useIdCardMapper'
import { type CustomerFormValues, CustomerSchema, useFormInitialValues } from '../../create/schema/customer.schema'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload'

const route = useRoute()
const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()

// formKey forces <Form> to remount after data loads so :initial-values is re-read cleanly
const formKey = ref<number>(0)
const form = ref<CustomerFormValues>(useFormInitialValues())
const resolver = zodResolver(CustomerSchema)

const customerId = computed((): string => route?.params?.id as string ?? '')

const isCorporate = computed((): boolean => form.value.personalType === PersonalTypeEnum.CORPORATE)

// Map the API response shape (ICustomerById) → CustomerFormValues
function useInit (data: ICustomerById): void {
  useInitForm(form, data)
  mount()
}

async function useFetch (): Promise<void> {
  const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  useInit(data)
}

async function useSubmit (): Promise<void> {
  if (!customerId.value) throw new Error('Customer ID is required')
  await CustomerService.updateCustomer(customerId.value, usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'CustomerDetailPage', params: { id: customerId.value } })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'CustomerDetailPage', params: { id: customerId.value } })
}

function mount (): void {
  formKey.value++
}

async function onReadIdCard (data: IReadIdCardResult): Promise<void> {
  form.value = await mapIdCardToCustomer(data, form.value)
  mount()
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>

<style scoped>

</style>
