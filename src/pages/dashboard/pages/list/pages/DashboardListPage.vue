<template>
  <section id="dashboard-list-page">
    <PageTitle />
    <BasePage class="max-w-none">
      <div class="px-3 pb-6 pt-0 bg-(--p-gray-1) min-h-full">
        <div class="mt-1 grid grid-cols-1 md:grid-cols-4">
          <LabelField label="สาขา">
            <BranchSelection multiple />
          </LabelField>
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-296">
          <SummaryCard
            v-for="(card, i) in data.summaryCards"
            :key="`${card.key}-${i}`"
            :amount="card.amount"
            :card-class="card.cardClass"
            :icon="card.icon"
            :icon-class="card.iconClass"
            :title="card.title" />
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-296">
          <SummaryCard
            v-for="(card, i) in data.statCards"
            :key="`${card.key}-${i}`"
            :amount="card.amount"
            :card-class="card.cardClass"
            :icon="card.icon"
            :icon-class="card.iconClass"
            :title="card.title" />
        </div>

        <div class="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-296">
          <MarketingDonutCard
            v-model:end="marketingEnd"
            v-model:start="marketingStart"
            :center-unit="data.marketing.centerUnit"
            :center-value="data.marketing.centerValue"
            :rows="data.marketing.rows"
            :title="data.marketing.title"
            period-label="ประจำเดือน" />
          <MarketingDonutCard
            v-model:end="loanSummaryEnd"
            v-model:start="loanSummaryStart"
            :center-unit="data.loanSummary.centerUnit"
            :center-value="data.loanSummary.centerValue"
            :rows="data.loanSummary.rows"
            :title="data.loanSummary.title"
            period-label="ประจำเดือน" />
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IDashboardData } from '@/models/response/dashboard/DashboardRes.model'
import DashboardProvider, { type IDashboardProvider } from '@/resources/provider/dashboard/Dashboard.provider'
import BasePage from '@/components/base/BasePage.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'
import MarketingDonutCard from '../components/MarketingDonutCard.vue'
import SummaryCard from '../components/SummaryCard.vue'

const marketingStart = ref<Date | string | null>(null)
const marketingEnd = ref<Date | string | null>(null)
const loanSummaryStart = ref<Date | string | null>(null)
const loanSummaryEnd = ref<Date | string | null>(null)

const DashboardService: IDashboardProvider = new DashboardProvider()

const data = ref<IDashboardData>({
  summaryCards: [],
  statCards: [],
  marketing: { title: '', centerValue: '', centerUnit: '', rows: [] },
  loanSummary: { title: '', centerValue: '', centerUnit: '', rows: [] }
})

const loadData = async (): Promise<void> => {
  data.value = await DashboardService.getDashboard()
}

loadData()
</script>
