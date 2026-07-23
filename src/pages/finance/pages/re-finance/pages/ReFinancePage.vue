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
        @edit="openModalEdit($event)"
        @remove="onRemoveExpense($event)" />
    </BasePage>

    <BasePage>
      <PaymentSummary
        :collection-fee="contract?.summary?.collectionFee"
        :installment-interests="installmentInterests"
        :interest="contract?.summary?.interest"
        :legal-fee="contract?.summary?.legalFee"
        :other-expenses="otherExpenses"
        :penalty-fee="contract?.summary?.penaltyFee"
        :principal="contract?.summary?.principal"
        @update:discount-interest-month="discountInterestMonth = $event"
        @update:discount-other="discountOther = $event"
        @update:grand-total="paymentGrandTotal = $event" />
    </BasePage>

    <BasePage>
      <div class="bg-[#ffd1d1] rounded-lg p-4 w-full flex justify-center">
        <span class="text-base text-[#bd0102]">ยอดชำระรวม {{ formatter.numberFormat2Decimal(paymentGrandTotal) }} บาท</span>
      </div>
    </BasePage>

    <BasePage>
      <PaymentMethodSelector v-model="paymentMethod" />
    </BasePage>

    <SaveExpenseModal
      v-model="showExpenseModal"
      :edit-data="editingExpenseData"
      :edit-index="editingExpenseIndex"
      @edit="onExpenseEdit($event)"
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { EVatType } from '@/enums/modules/Vat.enum'
import type { IRefinanceContract, IRefinanceCustomer, IRefinanceInstallment } from '@/models/response/refinance/RefinanceRes.model'
import type { IRefinanceExpense } from '@/models/request/refinance/RefinanceReq.model'
import type { ICloseContractFile } from '@/models/request/close-contract/CloseContractReq.model'
import RefinanceProvider, { type IRefinanceProvider } from '@/resources/provider/refinance/Refinance.provider'
import UploadProvider, { type IMedia } from '@/resources/provider/Upload.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import type { IAdditionalExpenseRow } from '../components/AdditionalExpensesTable.vue'
import AdditionalExpensesTable from '../components/AdditionalExpensesTable.vue'
import CustomerInfoCard from '../components/CustomerInfoCard.vue'
import type { IInstallmentRow } from '../components/InstallmentTable.vue'
import InstallmentTable from '../components/InstallmentTable.vue'
import PaymentSummary from '../components/PaymentSummary.vue'
import SaveExpenseModal from '../components/SaveExpenseModal.vue'
import type { TReceiptPaymentMethodLocal } from '@/pages/finance/components/shared/PaymentMethodSelector.vue'
import PaymentMethodSelector from '@/pages/finance/components/shared/PaymentMethodSelector.vue'
import ThaiQRPaymentModal from '@/pages/finance/pages/receipt/create/components/ThaiQRPaymentModal.vue'
import { useQRPayment } from '@/composables/useQRPayment'

const route = useRoute()
const router = useRouter()
const RefinanceService: IRefinanceProvider = new RefinanceProvider()
const UploadService = new UploadProvider()
const { qrModalVisible, qrImage, qrTrxId, qrExpiresAt, handlePaymentResponse, checkReceiptReference, cancelQrCode, mapPaymentType } = useQRPayment()

// expense modal
const showExpenseModal = ref<boolean>(false)
const editingExpenseIndex = ref<number | null>(null)
const editingExpenseData = ref<IRefinanceExpense | null>(null)
const additionalExpenses = ref<IAdditionalExpenseRow[]>([])

const contractId = computed((): string => route.params?.id as string)
const paymentMethod = ref<TReceiptPaymentMethodLocal>('cash')
const customer = ref<IRefinanceCustomer | null>(null)
const contract = ref<IRefinanceContract | null>(null)
const expenses = ref<IRefinanceExpense[]>([])
const paymentGrandTotal = ref<number>(0)
const discountInterestMonth = ref<number>(0)
const discountOther = ref<number>(0)

const installmentRows = computed((): IInstallmentRow[] => {
  if (!contract.value?.installments) return []
  return contract.value.installments.map(
    (item: IRefinanceInstallment): IInstallmentRow => ({
      label: `งวดที่ ${item.order}`,
      penalty: item.penaltyFee,
      collection: item.collectionFee,
      lawyer: item.legalFee,
      principal: item.principal,
      interest: item.interest,
      total: item.total
    })
  )
})

const otherExpenses = computed((): number =>
  additionalExpenses.value.reduce((total: number, expense: IAdditionalExpenseRow): number => total + expense.amount, 0)
)

const installmentInterests = computed((): number[] =>
  contract.value?.installments?.map((item: IRefinanceInstallment): number => item.interest) ?? []
)

function onRemoveExpense (index: number): void {
  additionalExpenses.value.splice(index, 1)
  expenses.value.splice(index, 1)
}

function onExpenseSubmit (data: IRefinanceExpense): void {
  additionalExpenses.value.push({
    label: data.remark ?? '',
    amount: data.amount
  })
  expenses.value.push({
    amount: data.amount,
    expenseCategoryId: data.expenseCategoryId,
    expenseTypeId: data.expenseTypeId,
    vatType: data.vatType as EVatType,
    remark: data.remark,
    files: data.files
  })
}

function openModalAdd (): void {
  editingExpenseIndex.value = null
  editingExpenseData.value = null
  showExpenseModal.value = true
}

function openModalEdit (index: number): void {
  editingExpenseIndex.value = index
  editingExpenseData.value = expenses.value[index] ?? null
  showExpenseModal.value = true
}

function onExpenseEdit (payload: { index: number, data: IRefinanceExpense }): void {
  additionalExpenses.value[payload.index] = {
    label: payload.data.remark ?? '',
    amount: payload.data.amount
  }
  expenses.value[payload.index] = payload.data
}

async function useFetch (): Promise<void> {
  const { data } = await RefinanceService.getRefinance(contractId.value)
  customer.value = data.customer
  contract.value = data.contract

  const receiptRef = data.customer.receiptReference
  checkReceiptReference(receiptRef)
}

async function uploadExpenseFiles (files: IMedia[]): Promise<ICloseContractFile[]> {
  const uploaded: ICloseContractFile[] = []
  for (const file of files) {
    if (file.file && file.isNew) {
      const response = await UploadService.uploadFile(file.file)
      uploaded.push({
        name: response.data.originalName,
        url: response.data.fileUrl,
        path: response.data.filePath
      })
    } else {
      uploaded.push({ name: file.name, url: file.url, path: file.path })
    }
  }
  return uploaded
}

async function useSubmit (): Promise<void> {
  const expensesWithFiles = await Promise.all(
    expenses.value.map(async (expense: IRefinanceExpense): Promise<IRefinanceExpense> => {
      const files = expense.files as IMedia[]
      if (files && files.length > 0) {
        const uploadedFiles = await uploadExpenseFiles(files)
        return { ...expense, files: uploadedFiles }
      }
      return expense
    })
  )

  const response = await RefinanceService.createRefinance(contractId.value, {
    paymentType: mapPaymentType(paymentMethod.value),
    discountInterestMonth: discountInterestMonth.value,
    discountOther: discountOther.value,
    otherExpenses: expensesWithFiles
  })
  if (handlePaymentResponse(response)) return
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
    await cancelQrCode(customer.value.id)
  }
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>
