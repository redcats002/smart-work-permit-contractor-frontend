<template>
  <section id="dashboard-list-page">
    <PageTitle />
    <BasePage class="max-w-none">
      <div class="px-3 pb-6 pt-0 -mt-2 bg-(--p-gray-1) min-h-full">
        <div class="mt-1">
          <BranchSelection
            :options="branchOptions"
            label="สาขา"
            required />
        </div>

        <div class="mt-5 w-full max-w-[1184px] min-h-[470px] grid grid-cols-1 xl:grid-cols-[437px_minmax(0,1fr)] gap-4">
          <div class="min-h-[470px] space-y-3">
            <SummaryCard
              v-for="card in summaryCards"
              :key="card.key"
              :amount="card.amount"
              :card-class="card.cardClass"
              :card-style="card.cardStyle"
              :icon-class="card.iconClass"
              :title="card.title">
              <template #icon>
                <Icon
                  :icon="card.icon"
                  class="h-6 w-6" />
              </template>
            </SummaryCard>
          </div>

          <div class="h-full">
            <MarketingDonutCard
              v-model:end="marketingEnd"
              v-model:start="marketingStart"
              :rows="marketing.rows"
              :title="marketing.title"
              :total-amount="marketing.totalAmount"
              :total-count="marketing.totalCount"
              period-label="ประจำเดือน" />
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1184px]">
          <StatCard
            v-for="stat in statCards"
            :key="stat.key"
            :card-style="debtCardStyle"
            :label="stat.label"
            :value="stat.value"
            :value-class="stat.valueClass"
            card-class="flex flex-col items-center justify-center gap-2.5" />
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchSelection from '../components/BranchSelection.vue'
import MarketingDonutCard from '../components/MarketingDonutCard.vue'
import StatCard from '../components/StatCard.vue'
import SummaryCard from '../components/SummaryCard.vue'
import { Icon } from '@iconify/vue'

const branchOptions = ['สำนักงานใหญ่', 'ขอนแก่น']

const marketingStart = ref<Date | string | null>(null)
const marketingEnd = ref<Date | string | null>(null)

const debtCardStyle = {
  height: '140px',
  padding: '32px',
  borderRadius: '8px',
  opacity: '1'
}

const dailyCardStyle = {
  width: '437px',
  height: '148.6666717529297px',
  gap: '10px',
  borderRadius: '8px',
  paddingTop: '20px',
  paddingRight: '16px',
  paddingBottom: '20px',
  paddingLeft: '16px',
  borderWidth: '0.5px',
  opacity: '1'
}

const cashCardStyle = {
  width: '437px',
  height: '148.66665649414062px',
  gap: '10px',
  borderRadius: '8px',
  paddingTop: '20px',
  paddingRight: '16px',
  paddingBottom: '20px',
  paddingLeft: '16px',
  opacity: '1'
}

const qrCardStyle = {
  width: '437px',
  height: '148.66665649414062px',
  gap: '10px',
  borderRadius: '8px',
  paddingTop: '20px',
  paddingRight: '16px',
  paddingBottom: '20px',
  paddingLeft: '16px',
  opacity: '1'
}

// Mock data (replace with API response when integrating)
const summaryCards = [
  {
    key: 'daily',
    title: 'สรุปยอดประจำวัน',
    amount: '200,000',
    icon: 'solar:wallet-linear',
    iconClass: 'bg-red-100 text-(--p-red)',
    cardClass: 'border border-(--p-red) p-0 gap-2.5',
    cardStyle: dailyCardStyle
  },
  {
    key: 'cash',
    title: 'ยอดเงินจากเงินสด',
    amount: '100,000',
    icon: 'solar:banknote-2-linear',
    iconClass: 'bg-emerald-100 text-emerald-600',
    cardClass: 'p-0 gap-2.5',
    cardStyle: cashCardStyle
  },
  {
    key: 'qr',
    title: 'ยอดเงินจาก QR Code',
    amount: '100,000',
    icon: 'solar:qr-code-linear',
    iconClass: 'bg-sky-100 text-sky-600',
    cardClass: 'p-0 gap-2.5',
    cardStyle: qrCardStyle
  }
]

const marketing = {
  title: 'แบบประเมินผลลัพธ์การตลาดในการปล่อยสินเชื่อ',
  totalAmount: '7,870,667',
  totalCount: '3,289',
  rows: [
    { label: 'ลูกค้าเก่า', count: '1,500', percent: '45.61%' },
    { label: 'รีไฟแนนซ์', count: '1,000', percent: '30.40%' },
    { label: 'ออนไลน์', count: '500', percent: '15.20%' },
    { label: 'ติดป้าย + แจกใบปลิว', count: '200', percent: '6.08%' },
    { label: 'มีผู้นำมา', count: '80', percent: '2.43%' },
    { label: 'เจอด้วยตัวเอง', count: '9', percent: '0.28%' }
  ]
}

const statCards = [
  { key: 'debt', label: 'ยอดหนี้คงเหลือ', value: '34,500', valueClass: 'text-[#F2994A]' },
  { key: 'principal', label: 'เงินต้นคงเหลือ', value: '30,000', valueClass: 'text-[#2F80ED]' },
  { key: 'interest', label: 'ดอกเบี้ยคงเหลือ', value: '10,133.80', valueClass: 'text-[#2F80ED]' }
]
</script>
