<template>
  <section id="customer-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="customer"
          @delete="onDelete()"
          @edit="onEdit()" />
        <CustomerTab
          :data="customer" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import CustomerTab from '../components/tab/CustomerTab.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()

const customer = useInitDetail()
const customerId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  customer.value = useInitDetail(data).value
}

async function useDelete (): Promise<void> {
  if (!customerId.value) throw new Error('Customer ID is required for deletion')
  await CustomerService.deleteCustomer(customerId.value)
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'CustomerListPage' })
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'CustomerEditPage', params: { id: customerId.value } })
}

function onDelete (): void {
  handleLoading(useDelete)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
