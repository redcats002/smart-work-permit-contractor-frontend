<template>
  <section id="receipt-detail-page">
    <PageTitle />
    <BasePage>
      <div class="flex justify-between mb-4">
        <BackButton />
        <PrintButton @click="onPrint()" />
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
      <BaseContainer>
        <div class="flex border border-[#e0e0e0] rounded overflow-hidden">
          <!-- Col: เลขที่สัญญา -->
          <div class="w-[120px] shrink-0 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-center px-2">
              <span class="font-bold text-[#333] text-sm text-center">เลขที่สัญญา</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`contract-${gi}`">
              <div
                :style="{ height: `${group.rows.length * 56}px` }"
                class="border-b border-[#e0e0e0] flex items-center justify-center px-2">
                <span class="font-bold text-[#bd0102] text-sm text-center break-all">{{ group.contractNo }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-center px-2">
              <span class="font-bold text-[#333] text-sm">รวม</span>
            </div>
          </div>

          <!-- Col: งวดที่ -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-center px-2">
              <span class="font-bold text-[#333] text-sm text-center">งวดที่</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`installment-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`installment-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-center px-2">
                <span class="text-[#333] text-sm">{{ row.installmentNo }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-center px-2">
              <span class="font-bold text-[#333] text-sm">-</span>
            </div>
          </div>

          <!-- Col: ค่าปรับ -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">ค่าปรับ</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`penalty-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`penalty-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.penalty) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.penalty) }}</span>
            </div>
          </div>

          <!-- Col: ค่าติดตาม -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">ค่าติดตาม</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`tracking-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`tracking-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.tracking) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.tracking) }}</span>
            </div>
          </div>

          <!-- Col: ค่าทนาย -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">ค่าทนาย</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`lawyer-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`lawyer-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.lawyer) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.lawyer) }}</span>
            </div>
          </div>

          <!-- Col: ดอกเบี้ย -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">ดอกเบี้ย</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`interest-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`interest-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.interest) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.interest) }}</span>
            </div>
          </div>

          <!-- Col: เงินต้น -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">เงินต้น</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`principal-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`principal-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.principal) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.principal) }}</span>
            </div>
          </div>

          <!-- Col: รวม -->
          <div class="flex-1 flex flex-col">
            <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">รวม</span>
            </div>
            <template
              v-for="(group, gi) in form.paymentGroups"
              :key="`total-group-${gi}`">
              <div
                v-for="(row, ri) in group.rows"
                :key="`total-${gi}-${ri}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(row.total) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totals.total) }}</span>
            </div>
          </div>
        </div>
      </BaseContainer>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IReceiptPaymentGroup, IReceiptPaymentRow } from '@/models/response/receipt/ReceiptRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useDetail from '../composables/useDetail'

interface ITotals {
  penalty: number
  tracking: number
  lawyer: number
  interest: number
  principal: number
  total: number
}

const router = useRouter()
const route = useRoute()
const { form, fetchById } = useDetail()
const dayjs = useDayjs()

const customerItems = computed((): IDisplayList[] => [
  { label: 'ชื่อ', key: 'name', value: formatter.fullName(form.value.customer) },
  { label: 'เลขที่ลูกค้า', key: 'id', value: form.value.customer.id },
  { label: 'เลขบัตรประชาชน', key: 'idCard', value: form.value.customer.idCard },
  { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(form.value.customer.birthDate ?? undefined) },
  { label: 'อายุ', key: 'age', value: dayjs.formatAge(String(form.value.customer.birthDate ?? '')) },
  { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: form.value.customer.customerGroup?.name ?? '-' },
  { label: 'อาชีพ', key: 'occupation', value: form.value.customer.occupation?.name ?? '-' },
  { label: 'เบอร์โทร', key: 'phoneNumber', value: form.value.customer.phoneNumber ?? '-' },
  { label: 'อีเมล', key: 'email', value: form.value.customer.email ?? '-' }
])

const receiptItems = computed((): IDisplayList[] => [
  { label: 'เลขที่ใบเสร็จ', key: 'receiptNo', value: form.value.receiptNo ?? '-' },
  { label: 'วันที่รับเงิน', key: 'dateOfPayment', value: dayjs.formatDate(form.value.dateOfPayment ?? undefined) },
  { label: 'ผู้รับเงิน', key: 'officer', value: formatter.fullName(form.value.officer) },
  { label: 'สาขา', key: 'branch', value: form.value.branch ?? '-' },
  { label: 'ช่องทางการชำระเงิน', key: 'paymentChannel', value: form.value.paymentChannel ?? '-' }
])

const totals = computed((): ITotals => {
  const allRows = form.value.paymentGroups.flatMap((g: IReceiptPaymentGroup): IReceiptPaymentRow[] => g.rows)
  return {
    penalty: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.penalty, 0),
    tracking: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.tracking, 0),
    lawyer: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.lawyer, 0),
    interest: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.interest, 0),
    principal: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.principal, 0),
    total: allRows.reduce((acc: number, r: IReceiptPaymentRow): number => acc + r.total, 0)
  }
})

function onPrint (): void {
  router.push({ name: 'ReceiptPrintPage', params: { id: route.params.id } })
}

onMounted((): void => {
  fetchById()
})
</script>

<style scoped>

</style>
