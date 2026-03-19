<template>
  <section
    id="report-list-page"
    class="bg-[#FAFAFE]">
    <PageTitle />
    <BasePage>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        <router-link
          v-for="(item, i) in reportItems"
          :key="`report-${i}`"
          :to="item.to"
          class="group flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm border border-surface-200 hover:border-(--p-red) hover:shadow-md transition-all">
          <span class="text-[16px] font-[550] leading-none tracking-normal text-surface-900">
            {{ item.label }}
          </span>
          <Icon
            class="text-black group-hover:text-black transition-colors"
            icon="mdi:chevron-right"
            width="20" />
        </router-link>
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
}

const reportItems: IReportItem[] = [
  { label: 'รายงานสรุปประจำวัน', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปบัญชีเทียบปัจจุบัน', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปประจำวันรวมทุกสาขา', to: { name: 'DailyBranchSummaryPage' } },
  { label: 'รายงานลูกหนี้คงเหลือ', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานรับชำระค่างวดประจำวัน', to: { name: 'DailyInstallmentPaymentReport' } },
  { label: 'รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์', to: { name: 'PercentInstallmentPage' } },
  { label: 'รายงานกำไรตามการรับชำระจริง', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปรับไฟแนนซ์ประจำปี', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปการปล่อยสินเชื่อ', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานการรับ/จ่ายประจำสาขา', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานการรับชำระเงินลูกหนี้ปิดบัญชี', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ', to: { name: 'RankingLendingPage' } },
  { label: 'รายงาน 1 - 25 การรับสินเชื่อ', to: { name: 'RankingLoanPage' } },
  { label: 'รายงานสัญญาและเอกสารหลักทรัพย์', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานสรุปสต็อกสินค้ารวม', to: { name: 'AllStockPage' } },
  { label: 'รายงานสาขา', to: { name: 'BranchSummaryPage' } },
  { label: 'รายงานลูกค้าค้างชำระ', to: { name: 'NotAvailablePage' } },
  { label: 'รายงานหัวหน้าสาขา', to: { name: 'NotAvailablePage' } }
]
</script>

<style scoped>

</style>
