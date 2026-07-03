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
              v-for="(contract, ci) in form.contracts"
              :key="`contract-${ci}`">
              <div
                :style="{ height: `${contract.installments.length * 56}px` }"
                class="border-b border-[#e0e0e0] flex items-center justify-center px-2">
                <span class="font-bold text-[#bd0102] text-sm text-center break-all">{{ contract.idNo }}</span>
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
              v-for="(contract, ci) in form.contracts"
              :key="`contract-group-${ci}`">
              <div
                v-for="(item, ii) in contract.installments"
                :key="`installment-${ci}-${ii}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-center px-2">
                <span class="text-[#333] text-sm">{{ item.order }}</span>
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
              v-for="(contract, ci) in form.contracts"
              :key="`penalty-group-${ci}`">
              <div
                v-for="(item, ii) in contract.installments"
                :key="`penalty-${ci}-${ii}`"
                class="h-14 border-b border-[#e0e0e0] flex items-center justify-end px-2">
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.penaltyFee) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(form.summary.penaltyFee) }}</span>
            </div>
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
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.collectionFee) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(form.summary.collectionFee) }}</span>
            </div>
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
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.legalFee) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(form.summary.legalFee) }}</span>
            </div>
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
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.interest) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(form.summary.interest) }}</span>
            </div>
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
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.principal) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(form.summary.principal) }}</span>
            </div>
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
                <span class="text-[#333] text-sm">{{ formatter.numberFormat(item.totalInstallment) }}</span>
              </div>
            </template>
            <div class="bg-[#bdbdbd] h-14 flex items-center justify-end px-2">
              <span class="font-bold text-[#333] text-sm">{{ formatter.numberFormat(totalAll) }}</span>
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
import { formatTitle } from '@/models/response/receipt/PaymentMethod.enum'
import type { IReceiptDetailContract, IReceiptDetailInstallment } from '@/models/response/receipt/ReceiptRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useDetail from '../composables/useDetail'

const router = useRouter()
const route = useRoute()
const { form, fetchById } = useDetail()
const dayjs = useDayjs()

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

const totalAll = computed((): number => {
  return form.value.contracts.reduce((acc: number, contract: IReceiptDetailContract): number => {
    return acc + contract.installments.reduce((sum: number, item: IReceiptDetailInstallment): number => sum + item.totalInstallment, 0)
  }, 0)
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
