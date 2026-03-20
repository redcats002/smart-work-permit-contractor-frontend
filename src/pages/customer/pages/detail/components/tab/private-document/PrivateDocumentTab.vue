<template>
  <div class="grid gap-2.5">
    <BaseContainer>
      <DisplayList :items="citizenItems" />
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="payrollItems" />
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="otherItems" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
// import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'

// import { useInitCustomerDocumentDetail } from '../../../composables/useInitDetail'

interface IProps {
  data: ICustomerById
}

const props = defineProps<IProps>()

// const route = useRoute()

// const CustomerService: ICustomerProvider = new CustomerProvider()

// const customerId = computed((): number => Number(route?.params?.id as string ?? ''))
// const customerDoc = useInitCustomerDocumentDetail()

const citizenItems = computed((): IDisplayList[] => {
  return [
    { label: 'บัตรประชาชน', key: 'citizenCardFile', value: props.data?.idCard },
    { label: 'จุดจัดเก็บเอกสาร', key: 'citizenCardStoredAt', value: '' }
  ]
})
const payrollItems = computed((): IDisplayList[] => {
  return [
    { label: 'สลิปเงินเดือน / หนังสือรับรองรายได้', key: 'payrollFile', value: '' },
    { label: 'จุดจัดเก็บเอกสาร', key: 'payrollStoredAt', value: '' }
  ]
})
const otherItems = computed((): IDisplayList[] => {
  return [
    { label: 'เอกสารอื่น ๆ', key: 'otherDocumentFile', value: '' },
    { label: 'จุดจัดเก็บเอกสาร', key: 'otherDocumentStoredAt', value: '' }
  ]
})

async function useFetch (): Promise<void> {
  // const { data } = await CustomerService.getCustomerDocumentFindOne(customerId.value)
  // customerDoc.value = useInitCustomerDocumentDetail(data).value
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
