<template>
  <section id="receipt-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <!-- Customer section -->
    <BasePage>
      <InformationDetail
        v-model:customer-id="customerId"
        :customer-id-query="customerIdQuery"
        :data="customer"
        @change="onCustomerChange()" />
    </BasePage>

    <!-- Contract sections -->
    <template
      v-for="(contract, ci) in contracts"
      :key="ci">
      <!-- Contract header -->
      <BasePage>
        <div
          class="bg-[#D31145] rounded-lg px-4 py-4 flex items-center justify-between cursor-pointer"
          @click="toggleCollapse(ci)">
          <div class="flex items-center gap-2">
            <Icon
              :class="collapsed.has(ci) ? '-rotate-90' : 'rotate-0'"
              class="text-white size-5 transition-transform"
              icon="mdi:chevron-down" />
            <span class="text-white font-bold text-base">เลขที่สัญญา : {{ contract.contractNo }}</span>
          </div>
          <div
            class="flex"
            @click.stop>
            <CheckboxInput
              :indeterminate="isContractIndeterminate(ci)"
              :model-value="contract.selectAll"
              @update:model-value="onSelectAllChange(ci, $event)" />
            <div class="text-white text-base">
              เลือกชำระทั้งหมด
            </div>
          </div>
        </div>
      </BasePage>

      <!-- Installment cards -->
      <BasePage
        v-for="(item, j) in contract.installments"
        v-show="!collapsed.has(ci)"
        :key="`${ci}-${j}`">
        <CardInstallment
          :data="item"
          :initial-selected="isPreSelected(ci, Number(item.id))"
          :installment-no="item.installmentNo"
          :select-all="contract.selectAll"
          :select-all-tick="contract.selectAllTick"
          @change="onInstallmentChange(Number(item.id), $event)"
          @select="onInstallmentSelect(ci, Number(item.id), $event)" />
      </BasePage>
    </template>

    <!-- Total amount -->
    <BasePage>
      <div class="bg-[#FFE8ED] rounded-lg px-4 py-4 flex justify-center">
        <span class="text-[#333] text-base font-bold">
          ยอดชำระรวม {{ formatter.numberFormat(totalAmount) }}
        </span>
      </div>
    </BasePage>

    <!-- Payment method -->
    <BasePage>
      <div class="flex gap-[13px] items-center">
        <!-- Cash card -->
        <div
          class="bg-white drop-shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-1 flex-col items-center p-4 rounded-lg cursor-pointer"
          @click="paymentMethod = EReceiptPaymentMethod.CASH">
          <div class="flex items-center gap-1">
            <div
              :class="paymentMethod === EReceiptPaymentMethod.CASH ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
              <div
                v-if="paymentMethod === EReceiptPaymentMethod.CASH"
                class="w-2 h-2 rounded-full bg-[#BD0102]" />
            </div>
            <span class="text-[#333] text-base">เงินสด</span>
          </div>
        </div>
        <!-- QR Code card -->
        <div
          class="bg-white drop-shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-1 flex-col items-center p-4 rounded-lg cursor-pointer"
          @click="paymentMethod = EReceiptPaymentMethod.BANK_TRANSFER">
          <div class="flex items-center gap-1">
            <div
              :class="paymentMethod === EReceiptPaymentMethod.BANK_TRANSFER ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
              <div
                v-if="paymentMethod === EReceiptPaymentMethod.BANK_TRANSFER"
                class="w-2 h-2 rounded-full bg-[#BD0102]" />
            </div>
            <span class="text-[#333] text-base">QR Code PromptPay</span>
          </div>
        </div>
      </div>
    </BasePage>

    <!-- Action buttons -->
    <BasePage>
      <FormAction
        @cancel="onCancel()"
        @confirm="onSubmit()" />
    </BasePage>

    <!-- Thai QR Payment Modal -->
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
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICreateReceiptPayload, IReceiptContractPayload, IReceiptInstallmentPayload } from '@/models/request/receipt/ReceiptReq.model'
import { EReceiptPaymentMethod, type TReceiptPaymentMethod } from '@/models/response/receipt/PaymentMethod.enum'
import type { IReceiptContractItem, IReceiptCustomerInfo, IReceiptInstallmentCreate } from '@/models/response/receipt/ReceiptRes.model'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CardInstallment from '../components/CardInstallment.vue'
import InformationDetail from '../components/InformationDetail.vue'
import ThaiQRPaymentModal from '../components/ThaiQRPaymentModal.vue'
import { Icon } from '@iconify/vue'
import { useInitDetail } from '../composables/useInitDetail'
import useGateway from '@/resources/gateway/useGateway'

interface IInstallmentItem extends IReceiptInstallmentCreate {
  installmentNo: number
}

interface IInstallmentContract {
  contractId: number
  contractNo: string
  selectAll: boolean
  selectAllTick: number
  installments: IInstallmentItem[]
}

interface IInstallmentChangePayload {
  amount: number
  discountPenaltyFee: number
}

const route = useRoute()
const router = useRouter()
const ReceiptService: IReceiptProvider = new ReceiptProvider()

const customerIdQuery = computed((): number | null => {
  return route?.query?.customerId ? Number(route.query.customerId) : null
})
const contractIdQuery = computed((): number | null => {
  return route?.query?.contractId ? Number(route.query.contractId) : null
})
const installmentIdQuery = computed((): number | null => {
  return route?.query?.installmentId ? Number(route.query.installmentId) : null
})
const customer = useInitDetail()
const customerId = ref<number | null>(customerIdQuery.value)

const contracts = ref<IInstallmentContract[]>([])
const collapsed = ref<Set<number>>(new Set())

function toggleCollapse (ci: number): void {
  if (collapsed.value.has(ci)) collapsed.value.delete(ci)
  else collapsed.value.add(ci)
  collapsed.value = new Set(collapsed.value) // ponytail: trigger reactivity
}
const paymentMethod = ref<TReceiptPaymentMethod>(EReceiptPaymentMethod.CASH)
const installmentAmounts = ref<Record<number, number>>({})
const installmentDiscounts = ref<Record<number, number>>({})
const installmentSelected = ref<Record<number, boolean>>({})
const qrModalVisible = ref<boolean>(false)
const qrImage = ref<string>('')
const qrTrxId = ref<string>('')
const qrExpiresAt = ref<string>('')


const totalAmount = computed((): number =>
  Object.values(installmentAmounts.value).reduce((acc: number, v: number): number => acc + v, 0)
)

function onInstallmentChange (id: number, payload: IInstallmentChangePayload): void {
  installmentAmounts.value = { ...installmentAmounts.value, [id]: payload.amount }
  installmentDiscounts.value = { ...installmentDiscounts.value, [id]: payload.discountPenaltyFee }
}

function isPreSelected (contractIdx: number, itemId: number): boolean {
  if (!contractIdQuery.value || !installmentIdQuery.value) return false
  const contract = contracts.value[contractIdx]
  return contract.contractId === contractIdQuery.value && itemId === installmentIdQuery.value
}

function isContractIndeterminate (contractIdx: number): boolean {
  const contract = contracts.value[contractIdx]
  if (!contract || contract.installments.length === 0) return false
  const anySelected = contract.installments.some(
    (item: IInstallmentItem): boolean => installmentSelected.value[item.id] === true
  )
  return anySelected && !contract.selectAll
}

function onSelectAllChange (contractIdx: number, val: boolean): void {
  contracts.value[contractIdx].selectAll = val
  contracts.value[contractIdx].selectAllTick++
  contracts.value[contractIdx].installments.forEach((item: IInstallmentItem): void => {
    installmentSelected.value[item.id] = val
  })
}

function onInstallmentSelect (contractIdx: number, installmentId: number, isSelected: boolean): void {
  installmentSelected.value = { ...installmentSelected.value, [installmentId]: isSelected }
  const contract = contracts.value[contractIdx]
  if (!contract) return
  contracts.value[contractIdx].selectAll = contract.installments.every(
    (item: IInstallmentItem): boolean => installmentSelected.value[item.id] === true
  )
}

async function fetchInstallments (id: number): Promise<void> {
  const { data } = await ReceiptService.getInstallmentsByCustomerId(id)
  customer.value = useInitDetail({
    id: data.customer.id,
    idNo: data.customer.idNo,
    idCard: data.customer.idCard,
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    birthDate: data.customer.birthDate,
    phoneNumber: data.customer.phoneNumber,
    email: data.customer.email,
    customerGroup: data.customer.customerGroup ?? undefined,
    occupation: data.customer.occupation ?? undefined
  }).value
  contracts.value = data.contracts.map((c: IReceiptContractItem): IInstallmentContract => ({
    contractId: c.id,
    contractNo: c.idNo,
    selectAll: false,
    selectAllTick: 0,
    installments: c.installments.map((item: IReceiptInstallmentCreate): IInstallmentItem => ({
      ...item,
      installmentNo: item?.order || 0
    }))
  }))
  installmentAmounts.value = {}
  installmentDiscounts.value = {}
  installmentSelected.value = {}

  // Check for unpaid QR receipt reference
  const receiptRef = (data.customer as IReceiptCustomerInfo).receiptReference
  if (receiptRef?.qrImage && receiptRef.expired && new Date(receiptRef.expired).getTime() > Date.now()) {
    qrImage.value = receiptRef.qrImage
    qrTrxId.value = String(receiptRef.id)
    qrExpiresAt.value = receiptRef.expired
    qrModalVisible.value = true
  }
}

async function onCustomerChange (): Promise<void> {
  if (customerId.value) {
    customer.value = useInitDetail().value
    contracts.value = []
    installmentAmounts.value = {}
    installmentDiscounts.value = {}
    installmentSelected.value = {}
    await handleLoading((): Promise<void> => fetchInstallments(Number(customerId.value)))
  }
}

async function onSubmit (): Promise<void> {
  if (!customerId.value) {
    toast.error('กรุณาเลือกลูกค้า')
    return
  }
  if (paymentMethod.value === EReceiptPaymentMethod.BANK_TRANSFER) {
    await handleLoading(async (): Promise<void> => {
      const payload: ICreateReceiptPayload = {
        paymentType: paymentMethod.value,
        customerId: customerId.value!,
        contracts: contracts.value
          .map((c: IInstallmentContract): IReceiptContractPayload => ({
            id: c.contractId,
            installments: c.installments
              .filter((item: IInstallmentItem): boolean => (installmentAmounts.value[item.id] ?? 0) > 0)
              .map((item: IInstallmentItem): IReceiptInstallmentPayload => ({
                id: item.id,
                discountPenaltyFee: installmentDiscounts.value[item.id] ?? 0,
                amount: installmentAmounts.value[item.id] ?? 0
              }))
          }))
          .filter((c: IReceiptContractPayload): boolean => c.installments.length > 0)
      }
      const response = await ReceiptService.createReceipt(payload) as unknown as { data: { trxId: string, qrImage: string, expired: string } }
      qrImage.value = response.data?.qrImage ?? ''
      qrTrxId.value = response.data?.trxId ?? ''
      qrExpiresAt.value = response.data?.expired ?? ''
      qrModalVisible.value = true
    })
    return
  }
  await handleLoading(async (): Promise<void> => {
    const payload: ICreateReceiptPayload = {
      paymentType: paymentMethod.value,
      customerId: customerId.value!,
      contracts: contracts.value
        .map((c: IInstallmentContract): IReceiptContractPayload => ({
          id: c.contractId,
          installments: c.installments
            .filter((item: IInstallmentItem): boolean => (installmentAmounts.value[item.id] ?? 0) > 0)
            .map((item: IInstallmentItem): IReceiptInstallmentPayload => ({
              id: item.id,
              discountPenaltyFee: installmentDiscounts.value[item.id] ?? 0,
              amount: installmentAmounts.value[item.id] ?? 0
            }))
        }))
        .filter((c: IReceiptContractPayload): boolean => c.installments.length > 0)
    }
    await ReceiptService.createReceipt(payload)
    toast.success('ดำเนินการสำเร็จ')
    router.push({ name: 'ReceiptListPage' })
  })
}

function onCancel (): void {
  router.push({ name: 'ReceiptListPage' })
}

async function onQrCancel (): Promise<void> {
  if (customerId.value) {
    await ReceiptService.cancelQrCode(customerId.value)
  }
  qrImage.value = ''
  qrTrxId.value = ''
  qrExpiresAt.value = ''
}

function onInitCustomer (): void {
  if (!customerIdQuery.value) return
  onCustomerChange()
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

onMounted(async (): Promise<void> => {
  await router.isReady()
  onInitCustomer()
  paymentGateway.initWatcher()
})

onUnmounted((): void => {
  paymentGateway.destroyWatcher()
})
</script>

<style scoped>

</style>
