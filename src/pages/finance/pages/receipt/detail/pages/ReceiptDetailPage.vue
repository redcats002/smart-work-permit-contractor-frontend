<template>
  <section id="receipt-detail-page">
    <PageTitle />
    <BasePage>
      <div class="flex justify-between mb-4">
        <BackButton />
        <div class="flex items-center gap-2">
          <PrintButton @click="onPrint()" />
          <BaseActionMenu :items="actionItems" />
        </div>
      </div>

      <!-- Info section -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Customer card -->
        <BaseContainer>
          <DisplayList :items="customerItems">
            <template #[`value.idCard`]="{ value }">
              <CitizenId :value="value" />
            </template>
          </DisplayList>
        </BaseContainer>

        <!-- Receipt card -->
        <BaseContainer>
          <DisplayList :items="receiptItems" />
        </BaseContainer>
      </div>

      <!-- Payment table -->
      <BaseContainer v-if="form.contracts.length > 0">
        <div class="border border-[#e0e0e0] rounded overflow-hidden">
          <div class="flex">
            <!-- Col: เลขที่สัญญา -->
            <div class="w-[120px] shrink-0 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-center px-2">
                <span class="font-bold text-[#333] text-sm text-center">เลขที่สัญญา</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`contract-${ci}`">
                <div
                  :style="{ height: `${contract.installments.length * 56}px` }"
                  class="border-b border-[#e0e0e0] flex items-center justify-center px-2">
                  <span class="font-bold text-[#bd0102] text-sm text-center whitespace-nowrap">{{ contract.idNo }}</span>
                </div>
              </template>
            </div>

            <!-- Col: งวดที่ -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-center px-2">
                <span class="font-bold text-[#333] text-sm text-center">งวดที่</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`contract-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`installment-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-center px-2">
                  <span class="text-[#333] text-sm">{{ item.order }}</span>
                </div>
              </template>
            </div>

            <!-- Col: ค่าปรับ -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">ค่าปรับ</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`penalty-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`penalty-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.penaltyFee) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: ค่าติดตาม -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">ค่าติดตาม</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`tracking-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`tracking-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.collectionFee) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: ค่าทนาย -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">ค่าทนาย</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`lawyer-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`lawyer-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.legalFee) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: ดอกเบี้ย -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">ดอกเบี้ย</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`interest-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`interest-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.interest) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: เงินต้น -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">เงินต้น</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`principal-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`principal-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.principal) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: ส่วนลดค่าปรับ -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">ส่วนลดค่าปรับ</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`discount-penalty-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`discount-penalty-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.discountPenaltyFee) }}</span>
                </div>
              </template>
            </div>

            <!-- Col: รวม -->
            <div class="flex-1 flex flex-col">
              <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
                <span class="font-bold text-[#333] text-sm">รวม</span>
              </div>
              <template
                v-for="(contract, ci) in form.contracts"
                :key="`total-group-${ci}`">
                <div
                  v-for="(item, ii) in contract.installments"
                  :key="`total-${ci}-${ii}`"
                  class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                  <span class="text-[#333] text-sm">{{ formatter.numberFormat2Decimal(item.totalAmount) }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="flex justify-end mt-4">
          <div class="flex flex-col gap-2 w-[280px]">
            <template
              v-for="(row, i) in summaryRows"
              :key="`summary-${i}`">
              <div
                v-if="row.type === 'text'"
                class="flex gap-[2px] items-center text-[14px] text-[#333]">
                <span class="font-bold w-[162px] whitespace-nowrap">{{ row.label }}</span>
                <div class="flex gap-[2px] items-center whitespace-nowrap">
                  <span class="font-normal">:</span>
                  <span
                    :style="row.bold ? 'font-weight: 800;' : ''"
                    class="font-normal">{{ row.displayValue }}</span>
                </div>
              </div>
              <SummaryRow
                v-else
                :bold="row.bold"
                :label="row.label"
                :value="row.value ?? 0" />
            </template>
          </div>
        </div>
      </BaseContainer>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import { formatTitle } from '@/models/response/receipt/PaymentMethod.enum'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import SummaryRow from '@/pages/finance/pages/close-account/components/SummaryRow.vue'
import useDetail from '../composables/useDetail'

interface ISummaryRow {
  label: string
  value?: number
  displayValue?: string
  bold?: boolean
  type: 'row' | 'text'
}

const router = useRouter()
const route = useRoute()
const { form, fetchById } = useDetail()
const dayjs = useDayjs()
const ReceiptService: IReceiptProvider = new ReceiptProvider()
const receiptId = computed((): number => Number(route.params.id))

const customerItems = computed((): IDisplayList[] => [
  { label: 'ชื่อ', key: 'name', value: formatter.fullName(form.value.customer) },
  { label: 'เลขที่ลูกค้า', key: 'idNo', value: form.value.customer.idNo },
  { label: 'เลขบัตรประชาชน', key: 'idCard', value: form.value.customer.idCard },
  { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(form.value.customer.birthDate ?? undefined) },
  { label: 'อายุ', key: 'age', value: dayjs.formatAge(String(form.value.customer.birthDate ?? '')) },
  { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: form.value.customer.customerGroup?.name ?? '-' },
  { label: 'อาชีพ', key: 'occupation', value: form.value.customer.occupation?.name ?? '-' },
  { label: 'เบอร์โทร', key: 'phoneNumber', value: form.value.customer.phoneNumber ?? '-' },
  { label: 'อีเมล', key: 'email', value: form.value.customer.email ?? '-' }
])

const receiptItems = computed((): IDisplayList[] => [
  { label: 'เลขที่ใบเสร็จ', key: 'receiptNo', value: form.value.idNo ?? '-' },
  { label: 'วันที่รับเงิน', key: 'dateOfPayment', value: dayjs.formatDate(form.value.paidAt ?? undefined) },
  { label: 'ผู้รับเงิน', key: 'receivedBy', value: form.value.receivedBy?.fullName || '-' },
  { label: 'สาขา', key: 'branch', value: form.value.branch?.name ?? '-' },
  { label: 'ช่องทางการชำระเงิน', key: 'paymentType', value: formatTitle(form.value.paymentType ?? undefined) }
])

const summaryRows = computed((): ISummaryRow[] => [
  { label: 'เงินต้น', value: form.value.summary.principal, type: 'row' },
  { label: 'ดอกเบี้ย', value: form.value.summary.interest, type: 'row' },
  { label: 'ค่าใช้จ่ายอื่นๆ', value: form.value.summary.otherExpenses, type: 'row' },
  { label: 'ค่าปรับ', value: form.value.summary.penaltyFee, type: 'row' },
  { label: 'ค่าติดตาม', value: form.value.summary.collectionFee, type: 'row' },
  { label: 'ค่าทนาย', value: form.value.summary.legalFee, type: 'row' },
  { label: `ส่วนลดดอกเบี้ย ${form.value.discountInterestMonth} เดือน`, displayValue: formatter.numberFormat2Decimal(form.value.summary.discountInterest), type: 'text' },
  { label: 'ส่วนลดอื่นๆ', value: form.value.summary.discountOther, type: 'row' },
  { label: 'ยอดรวม', value: form.value.summary.totalAmount, bold: true, type: 'row' }
])

const isPendingRefinance = computed((): boolean => form.value.receiptType === 'PENDING_REFINANCE')

const actionItems = computed((): IMenuItemAction[] => [
  {
    label: 'ยกเลิกใบเสร็จ',
    key: 'cancel-receipt',
    type: 'DELETE',
    disabled: isPendingRefinance.value,
    action: (): void => {
      handleLoading(async (): Promise<void> => {
        await ReceiptService.deleteReceipt(receiptId.value)
        toast.success('ดำเนินการสำเร็จ')
        router.push({ name: 'ReceiptListPage' })
      })
    }
  }
])

function onPrint (): void {
  router.push({ name: 'ReceiptPrintPage', params: { id: route.params.id } })
}

onMounted((): void => {
  fetchById()
})
</script>

<style scoped>

</style>
