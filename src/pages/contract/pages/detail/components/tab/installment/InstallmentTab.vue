<template>
  <div class="grid gap-2.5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <CardIndicator
        v-for="(card, i) in cards"
        :key="`card-${i}`"
        v-bind="card" />
    </div>
    <div class="flex justify-between items-center">
      <span>ตารางการชำระ</span>
      <span><ConfirmButton
        :to="{}"
        label="ชำระเงิน" /></span>
      <!-- TODO: to document-and-finance detail -->
    </div>
    <InstallmentTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @create-invoice="onCreateInvoice($event)"
      @update="fetch()"
      @update-collection-fee="onUpdateCollectionFee($event)"
      @update-legal-fee="onUpdateLegalFee($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInstallmentList } from '@/models/request/contract/ContractReq.model'
import type { IContractById, IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import CardIndicator, { type ICardIndicator } from '@/components/card/CardIndicator.vue'
import usePagination from '@/composables/usePagination'
import InstallmentTable from './InstallmentTable.vue'

const ContractService: IContractProvider = new ContractProvider()
const InvoiceService: IInvoiceProvider = new InvoiceProvider()

interface IProps {
  data: IContractById
}
const props = defineProps<IProps>()

const route = useRoute()
const { pagination, sortBy, sortOrder, syncQuery } = usePagination()

const filters = ref<IGetInstallmentList>({})
const items = ref<IContractInstallmentList[]>([])

const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const cards = computed((): ICardIndicator[] => [
  { label: 'ยอดหนี้คงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding?.total), valueClass: 'text-orange-400' },
  { label: 'เงินต้นคงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding.principal), valueClass: 'text-blue-400' },
  { label: 'ดอกเบี้ยคงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding.interest), valueClass: 'text-blue-400' }
])

async function useFetch (): Promise<void> {
  const listResponse = await ContractService.getInstallmentList(contractId.value)
  items.value = listResponse?.data || []
  // summary.value = summaryResponse?.data || summary.value
  syncQuery({ ...normalizeFilters(filters.value) })
}

function normalizeFilters (value: IGetInstallmentList): Partial<IGetInstallmentList> {
  return {
    ...value
  }
}

function onCreateInvoice (id: number): void {
  handleLoading(async (): Promise<void> => {
    await InvoiceService.createInvoice(id, []) // WAIT BACKEND
    toast.success('ออกใบแจ้งหนี้สำเร็จ')
  })
}

function onUpdateCollectionFee (payload: { id: number, amount: number }): void {
  handleLoading(async (): Promise<void> => {
    await ContractService.updateCollectionFee(payload.id, { amount: payload.amount })
    toast.success('บันทึกค่าติดตามสำเร็จ')
    fetch()
  })
}

function onUpdateLegalFee (payload: { id: number, amount: number }): void {
  handleLoading(async (): Promise<void> => {
    await ContractService.updateLegalFee(payload.id, { amount: payload.amount })
    toast.success('บันทึกค่าทนายสำเร็จ')
    fetch()
  })
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
