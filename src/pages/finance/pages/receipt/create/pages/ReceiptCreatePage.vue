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
          :data="customer" />
      </div>
    </BasePage>
    <BasePage
      v-for="(item, index) in installment"
      :key="index">
      <div class="grid grid-cols-1 gap-2.5">
        <CardInstallment
          :data="item" />
      </div>
    </BasePage>
    <BasePage>
      <FormAction @cancel="onCancel()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useRoute, useRouter } from 'vue-router'
// import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IReceiptInstallment } from '@/models/response/receipt/ReceiptRes.model'
// import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
// import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CardInstallment from '../components/CardInstallment.vue'
import InformationDetail from '../components/InformationDetail.vue'
import { useInitDetail } from '../composables/useInitDetail'

// const route = useRoute()
const router = useRouter()

// const CustomerService: ICustomerProvider = new CustomerProvider()

const customer = useInitDetail()
const installment = ref<IReceiptInstallment[]>([])
// const customerId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  // const { data } = await CustomerService.getCustomerFindOne(customerId.value)
  customer.value = useInitDetail({
    id: 124121221,
    status: 'ACTIVE',
    idCard: '1233030390122',
    titleName: 'MR',
    firstName: '',
    lastName: '',
    phoneNumber: '099999999',
    birthDate: '2012-04-23T18:25:43.511Z',
    email: 'Pichai@mail.com',
    customerGroup: {
      id: 0,
      name: 'ลูกค้าใหม่'
    }
  }).value

  installment.value = [
    {
      id: 0,
      status: 'PARTIALLY_PAID',
      contractNo: 'LC-00001',
      installmentDate: '',
      installmentPrice: 8561,
      interest: 200,
      paid: 3000,
      outstanding: 5761
    },
    {
      id: 1,
      status: 'OVERDUE',
      contractNo: 'LC-00001',
      installmentDate: '',
      installmentPrice: 8612,
      interest: 200,
      paid: 0,
      outstanding: 0
    }
  ]
}
function onCancel (): void {
  router.push({ name: 'ReceiptListPage' })
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
