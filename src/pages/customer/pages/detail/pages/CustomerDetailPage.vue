<template>
  <section id="customer-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail :data="customer" />
        <CustomerTab :data="customer" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import CustomerTab from '../components/tab/CustomerTab.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()

const CustomerService: ICustomerProvider = new CustomerProvider()

const customer = useInitDetail()
const customerId = computed((): string => route?.params?.id as string ?? '')

async function useFetch (): Promise<void> {
  const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  customer.value = useInitDetail(data).value
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
