<template>
  <section id="report-list-page">
    <PageTitle />
    <BasePage>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        <RouterLink
          v-for="(item, i) in reportItems"
          :key="`report-${i}`"
          v-slot="{ isActive, isExactActive, navigate }"
          :to="item.to"
          custom>
          <div
            :class="[
              `group flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm border border-surface-200
              hover:border-(--p-red) hover:shadow-md transition-all cursor-pointer`,
              (isActive || isExactActive) && !item.disabled && 'bg-(--p-red)! text-white!',
              item.disabled && 'cursor-not-allowed opacity-50 pointer-events-none'
            ]"
            @click="!item.disabled && navigate($event)">
            <span class="text-[16px] font-[550] leading-none tracking-normal text-surface-900">
              {{ item.label }}
            </span>
            <Icon
              class="text-black group-hover:text-black transition-colors"
              icon="mdi:chevron-right"
              width="20" />
          </div>
        </RouterLink>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { Icon } from '@iconify/vue'

interface IReportItem {
  label: string
  to: { name: string }
  disabled?: boolean
}

const reportItems: IReportItem[] = [
  { label: 'รายงานสรุปประจำวัน', to: { name: 'DailyBranchSummaryPage' } },
  { label: 'รายงานสรุปบัญชีเทียบปัจจุบัน', to: { name: 'ComparativeListPage' } },
  { label: 'รายงานสรุปประจำวันรวมทุกสาขา', to: { name: 'DailyBranchSummaryPage' } },
  { label: 'รายงานลูกหนี้คงเหลือ', to: { name: 'OutstandingDebtorPage' } },
  { label: 'รายงานรับชำระค่างวดประจำวัน', to: { name: 'DailyInstallmentListPage' } },
  { label: 'รายงานปล่อยสินเชื่อประจำวัน', to: { name: 'DailyLoanDisbursementPage' } },
  { label: 'รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์', to: { name: 'PercentInstallmentPage' } },
  { label: 'รายงานกำไรตามการรับชำระจริง', to: { name: 'ProfitBasedOnActualPaymentPage' } },
  { label: 'รายงานสรุปรับไฟแนนซ์ประจำปี', to: { name: 'NotAvailablePage' }, disabled: true },
  { label: 'รายงานสรุปการปล่อยสินเชื่อ', to: { name: 'LoanDisbursementSummaryPage' } },
  { label: 'รายงานการรับ/จ่ายประจำสาขา', to: { name: 'BranchIncomeExpensePage' } },
  { label: 'รายงานการรับชำระเงินลูกหนี้ปิดบัญชี', to: { name: 'PaymentsForAccountClosurePage' } },
  { label: 'รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย', to: { name: 'FinancialSummaryPage' } },
  { label: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ', to: { name: 'RankingLendingPage' } },
  { label: 'รายงาน 1 - 25 การรับสินเชื่อ', to: { name: 'RankingLoanPage' } },
  { label: 'รายงานสัญญาและเอกสารหลักทรัพย์', to: { name: 'NotAvailablePage' }, disabled: true },
  { label: 'รายงานสรุปสต็อกสินค้ารวม', to: { name: 'AllStockPage' } },
  { label: 'รายงานสาขา', to: { name: 'BranchSummaryPage' } },
  { label: 'รายงานลูกค้าค้างชำระ', to: { name: 'OverdueCustomerPage' } },
  { label: 'รายงานหัวหน้าสาขา', to: { name: 'BranchHeadSummaryPage' }, disabled: true },
  { label: 'รายงานสัญญาและเอกสารหลักทรัพย์', to: { name: 'ContractSecurityDocumentPage' } }
]
</script>

<style scoped></style>
