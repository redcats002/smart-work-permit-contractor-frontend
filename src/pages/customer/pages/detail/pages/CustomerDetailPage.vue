<template>
  <section id="customer-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <div
      class="mx-auto max-w-6xl pt-4">
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail />
        <CustomerTab />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import CustomerTab from '../components/tab/CustomerTab.vue'
import { useFormInitialValues } from '../../create/schema/customer.schema'

const route = useRoute()

const CustomerService: ICustomerProvider = new CustomerProvider()

const customer = ref<IActionCustomerPayload>(useFormInitialValues() as IActionCustomerPayload)
const customerId = computed((): string => route?.params?.id as string ?? '')

function useInitDetail (data: ICustomerById): void {
  customer.value = {
    ...data,
    customerGroupId: data?.customerGroup?.id || undefined,
    jobId: data?.job?.id || undefined
  }
}

async function useFetch (): Promise<void> {
  const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  useInitDetail(data)
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
