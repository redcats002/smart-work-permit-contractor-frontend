<template>
  <section id="re-finance-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>

    <BasePage>
      <CustomerInfoCard
        :age="customer?.age"
        :birth-date="customer?.birthDate"
        :customer-group="customer?.customerGroup?.name"
        :customer-name="`${customer?.titleName} ${customer?.firstName} ${customer?.lastName}`"
        :email="customer?.email"
        :id-card="customer?.idCard"
        :occupation="customer?.occupation?.name"
        :phone-numbers="customer?.phoneNumber" />
    </BasePage>

    <BasePage>
      <InstallmentTable :rows="installmentRows" />
    </BasePage>

    <BasePage>
      <AdditionalExpensesTable
        :rows="additionalExpenses"
        @add="openModalAdd()"
        @remove="onRemoveExpense($event)" />
    </BasePage>

    <BasePage>
      <PaymentSummary
        :interest="contract?.summary?.interest"
        :other-expenses="otherExpenses"
        :principal="contract?.summary?.principal" />
    </BasePage>

    <BasePage>
      <div class="bg-[#ffd1d1] rounded-lg p-4 w-full flex justify-center">
        <span class="text-base text-[#bd0102]">ยอดชำระรวม {{ formatNumber(grandTotal) }} บาท</span>
      </div>
    </BasePage>

    <BasePage>
      <PaymentMethodSelector v-model="paymentMethod" />
    </BasePage>

    <SaveExpenseModal
      v-model="showExpenseModal"
      @submit="onExpenseSubmit($event)" />

    <BasePage>
      <div class="flex gap-4 items-center flex-wrap">
        <ConfirmModal
          description="ยืนยันการรีไฟแนนซ์สัญญานี้?"
          label="ยืนยันการรีไฟแนนซ์"
          @confirm="onSubmit()">
          <template #activator="{ open }">
            <button
              class="bg-[#bd0102] hover:bg-[#a00001] h-10 px-6 rounded text-white text-base cursor-pointer"
              type="button"
              @click="open()">
              ถัดไป
            </button>
          </template>
        </ConfirmModal>
        <button
          class="bg-white border border-[#bd0102] hover:bg-[#fff5f5] h-10 px-6 rounded text-[#bd0102] text-base cursor-pointer"
          type="button"
          @click="onCancel()">
          ยกเลิก
        </button>
      </div>
    </BasePage>

    <ThaiQRPaymentModal
      v-model="qrModalVisible"
      :expires-at="qrExpiresAt"
      :qr-image="qrImage"
      :trx-id="qrTrxId"
      @cancel="onQrCancel()" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { formatter } from '@/utils/Formatter'
import { PaymentMethodEnum } from '@/enums/modules/contract/PaymentMethod.enum'
import type { IRefinanceContract, IRefinanceCustomer, IRefinanceExpense, IRefinanceInstallment } from '@/models/response/refinance/RefinanceRes.model'
import RefinanceProvider, { type IRefinanceProvider } from '@/resources/provider/refinance/Refinance.provider'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import type { IAdditionalExpenseRow } from '../components/AdditionalExpensesTable.vue'
import type { IInstallmentRow } from '../components/InstallmentTable.vue'
import AdditionalExpensesTable from '../components/AdditionalExpensesTable.vue'
import CustomerInfoCard from '../components/CustomerInfoCard.vue'
import InstallmentTable from '../components/InstallmentTable.vue'
import PaymentMethodSelector, { type TPaymentMethod } from '../components/PaymentMethodSelector.vue'
import PaymentSummary from '../components/PaymentSummary.vue'
import SaveExpenseModal from '../components/SaveExpenseModal.vue'
import ThaiQRPaymentModal from '@/pages/finance/pages/receipt/create/components/ThaiQRPaymentModal.vue'
import useGateway from '@/resources/gateway/useGateway'

const route = useRoute()
const router = useRouter()
const RefinanceService: IRefinanceProvider = new RefinanceProvider()
const ReceiptService: IReceiptProvider = new ReceiptProvider()

const contractId = computed((): string => route.params?.id as string)
const paymentMethod = ref<TPaymentMethod>('cash')
const showExpenseModal = ref<boolean>(false)
const additionalExpenses = ref<IAdditionalExpenseRow[]>([])
const customer = ref<IRefinanceCustomer | null>(null)
const contract = ref<IRefinanceContract | null>(null)
const expenses = ref<IRefinanceExpense[]>([])
const qrModalVisible = ref<boolean>(false)
const qrImage = ref<string>('')
const qrTrxId = ref<string>('')
const qrExpiresAt = ref<string>('')

const installmentRows = computed((): IInstallmentRow[] => {
  if (!contract.value?.installments) return []
  return contract.value.installments.map((item: IRefinanceInstallment): IInstallmentRow => ({
    label: `งวดที่ ${item.order}`,
    penalty: item.penaltyFee,
    collection: item.collectionFee,
    lawyer: item.legalFee,
    principal: item.principal,
    interest: item.interest,
    total: item.total
  }))
})

const otherExpenses = computed((): number => additionalExpenses.value.reduce((total: number, expense: IAdditionalExpenseRow): number =>
  total + expense.amount, 0))

const grandTotal = computed((): number => {
  const summary = contract.value?.summary
  if (!summary) return 0
  return summary.principal + summary.interest + otherExpenses.value
})

function formatNumber (value: number): string {
  return formatter.numberFormat(value)
}

function onRemoveExpense (index: number): void {
  additionalExpenses.value.splice(index, 1)
}

function onExpenseSubmit (data: { note: string, amount: number }): void {
  additionalExpenses.value.push({
    label: data.note,
    amount: data.amount
  })
}

function openModalAdd (): void {
  showExpenseModal.value = true
}

async function useFetch (): Promise<void> {
  const { data } = await RefinanceService.getRefinance(contractId.value)
  customer.value = data.customer
  contract.value = data.contract

  const receiptRef = (data.customer as unknown as { receiptReference?: { id: number, qrImage: string, expired: string } | null }).receiptReference
  if (receiptRef?.qrImage && receiptRef.expired && new Date(receiptRef.expired).getTime() > Date.now()) {
    qrImage.value = receiptRef.qrImage
    qrTrxId.value = String(receiptRef.id)
    qrExpiresAt.value = receiptRef.expired
    qrModalVisible.value = true
  }
}

async function useSubmit (): Promise<void> {
  const paymentTypeMap: Record<TPaymentMethod, PaymentMethodEnum> = {
    cash: PaymentMethodEnum.CASH,
    qr: PaymentMethodEnum.BANK_TRANSFER
  }
  const response = await RefinanceService.createRefinance(contractId.value, {
    paymentType: paymentTypeMap[paymentMethod.value],
    otherExpenses: expenses.value
  }) as unknown as { data: { qrImage?: string, expired?: string, trxId?: string } }
  if (paymentMethod.value === 'qr' && response.data?.qrImage) {
    qrImage.value = response.data.qrImage
    qrTrxId.value = response.data.trxId ?? ''
    qrExpiresAt.value = response.data.expired ?? ''
    qrModalVisible.value = true
    return
  }
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ReceiptListPage' })
}

function onSubmit (): void {
  handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'ReceiptListPage' })
}

async function onQrCancel (): Promise<void> {
  if (customer.value?.id) {
    await ReceiptService.cancelQrCode(customer.value.id)
  }
  qrImage.value = ''
  qrTrxId.value = ''
  qrExpiresAt.value = ''
}

function onPaymentCallback (): void {
  qrModalVisible.value = false
  qrImage.value = ''
  qrTrxId.value = ''
  qrExpiresAt.value = ''
  toast.success('ชำระเงินสำเร็จ')
  router.push({ name: 'ReceiptListPage' })
}

const paymentGateway = useGateway('callback-payment-qrcode', onPaymentCallback)

onMounted((): void => {
  handleLoading(useFetch)
  paymentGateway.initWatcher()
})

onUnmounted((): void => {
  paymentGateway.destroyWatcher()
})
</script>
