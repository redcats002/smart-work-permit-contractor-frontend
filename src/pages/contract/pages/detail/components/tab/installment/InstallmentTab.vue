<template>
  <div class="grid gap-2.5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <CardIndicator
        v-for="(card, i) in cards"
        :key="`card-${i}`"
        label-class="font-bold mt-4"
        v-bind="card" />
    </div>
    <div class="flex justify-between items-center">
      <span>ตารางการชำระ</span>
      <div class="flex gap-2.5">
        <ConfirmModal
          v-if="isDev || isAlpha || isStaging"
          label="ทดสอบวันครบกำหนด"
          @confirm="onTestDueDate()">
          <template #activator="{open}">
            <Button
              :disabled="!isAbleToTestDueDate"
              class="text-sm"
              label="ทดสอบวันครบกำหนด"
              variant="outlined"
              @click="open()" />
          </template>
        </ConfirmModal>
        <router-link
          v-if="isAbleToPayment"
          :to="{ name: 'ReceiptCreatePage', query: { customerId: mainBorrowerId } }">
          <ConfirmButton
            label="ชำระเงิน" />
        </router-link>
      </div>
    </div>
    <InstallmentTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :items="items"
      @create-invoice="onCreateInvoice($event)"
      @payment="onPayment($event)"
      @update="fetch()"
      @update-collection-fee="onUpdateCollectionFee($event)"
      @update-legal-fee="onUpdateLegalFee($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetInstallmentList } from '@/models/request/contract/ContractReq.model'
import type { IBorrowersItems, IContractById, IContractInstallmentList } from '@/models/response/contract/ContractRes.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum.ts'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import CardIndicator, { type ICardIndicator } from '@/components/card/CardIndicator.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import useDev from '@/composables/useDev'
import usePagination from '@/composables/usePagination'
import InstallmentTable from './InstallmentTable.vue'

interface IProps {
  data: IContractById
}
const props = defineProps<IProps>()
defineOptions({
  inheritAttrs: false
})

const ContractService: IContractProvider = new ContractProvider()
const InvoiceService: IInvoiceProvider = new InvoiceProvider()

const route = useRoute()
const router = useRouter()

const { pagination, sortBy, sortOrder, syncQuery, extractPagination } = usePagination()
const { isAlpha, isDev, isStaging } = useDev()

const filters = ref<IGetInstallmentList>({})
const items = ref<IContractInstallmentList[]>([])

const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)
const isAbleToPayment = computed((): boolean => {
  const ableStatus: TContractStatus[] = ['PENDING']
  return ableStatus.includes(props.data?.status)
})
const isAbleToTestDueDate = computed((): boolean => {
  const ableStatus: TContractStatus[] = ['PENDING']
  return ableStatus.includes(props.data?.status)
})
const paginateQuery = computed((): IGetInstallmentList => {
  const normalizedFilters = normalizeFilters(filters.value)
  return {
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: sortBy.value || undefined,
    sortOrder: sortOrder.value,
    ...normalizedFilters
  }
})
const mainBorrowerId = computed((): string | number | undefined => {
  const main = props.data?.borrowers?.find((b: IBorrowersItems): boolean => b.isMain)
  return main?.customer?.id
})
const cards = computed((): ICardIndicator[] => [
  { label: 'ยอดหนี้คงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding?.total), valueClass: 'text-orange-400' },
  { label: 'เงินต้นคงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding.principal), valueClass: 'text-blue-400' },
  { label: 'ดอกเบี้ยคงเหลือ', value: formatter.numberFormat2Decimal(props.data?.outstanding.interest), valueClass: 'text-blue-400' }
])

async function useFetch (): Promise<void> {
  const listResponse = await ContractService.getInstallmentList(contractId.value, paginateQuery.value)
  items.value = listResponse?.data || []
  pagination.value = extractPagination(listResponse)
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
    const response = await InvoiceService.createInvoice(id, []) // WAIT BACKEND
    toast.success('ออกใบแจ้งหนี้สำเร็จ')
    const url = router.resolve({ name: 'InvoiceDetailPage', params: { id: response?.data.id } })
    window.open(url.href, '_blank')
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

function onTestDueDate (): void {
  handleLoading(async (): Promise<void> => {
    await ContractService.testDueDate(contractId.value)
    toast.success('ทดสอบวันครบกำหนดสำเร็จ')
    fetch()
  })
}

function onPayment (id: number): void {
  router.push({ name: 'ReceiptCreatePage', query: { customerId: mainBorrowerId.value, installmentId: id, contractId: contractId.value } })
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
