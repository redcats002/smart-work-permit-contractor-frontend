<template>
  <section id="dashboard-list-page">
    <PageTitle />
    <BasePage class="max-w-none">
      <div class="px-3 pb-6 pt-0 bg-(--p-gray-1) min-h-full">
        <div class="mt-1 grid grid-cols-1 md:grid-cols-4">
          <LabelField label="สาขา">
            <BranchSelection v-model="branchId" />
          </LabelField>
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-296">
          <SummaryCard
            v-for="(card, i) in summaryCards"
            :key="`${card.key}-${i}`"
            :amount="card.amount"
            :card-class="card.cardClass"
            :icon="card.icon"
            :icon-class="card.iconClass"
            :title="card.title" />
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-296">
          <SummaryCard
            v-for="(card, i) in statCards"
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
            :center-unit="CHART_MARKET_UNIT"
            :center-value="marketingCenterValue"
            :rows="marketingRows"
            :title="CHART_MARKET_TITLE"
            period-label="ประจำเดือน" />
          <MarketingDonutCard
            v-model:end="loanEnd"
            v-model:start="loanStart"
            :center-unit="CHART_LOAN_UNIT"
            :center-value="loanCenterValue"
            :rows="loanRows"
            :title="CHART_LOAN_TITLE"
            period-label="ประจำเดือน" />
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IDashboardDonutRow } from '@/models/modules/dashboard/Dashboard.model'
import type { IDashboardCardData, IDashboardChartData, IDashboardChartItem } from '@/models/response/dashboard/DashboardRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import DashboardProvider, { type IDashboardProvider } from '@/resources/provider/dashboard/Dashboard.provider'
import BasePage from '@/components/base/BasePage.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'
import MarketingDonutCard from '../components/MarketingDonutCard.vue'
import SummaryCard from '../components/SummaryCard.vue'

interface ICardConfig {
  key: string
  title: string
  icon: string
  iconClass: string
  cardClass: string
}

interface IDashboardCardItem extends ICardConfig {
  amount: string
}


const CHART_MARKET_TITLE = 'แบบประเมินผลลัพธ์การตลาดในการปล่อยสินเชื่อ'
const CHART_LOAN_TITLE = 'สรุปยอดปล่อยสินเชื่อ'
const CHART_MARKET_UNIT = 'ราย'
const CHART_LOAN_UNIT = 'บาท'

const SUMMARY_CARDS: ICardConfig[] = [
  { key: 'daily', title: 'สรุปยอดประจำวัน', icon: 'solar:wallet-linear', iconClass: 'bg-red-100 text-(--p-red)', cardClass: 'border border-(--p-gray-5)' },
  { key: 'cash', title: 'ยอดเงินจากเงินสดประจำวัน', icon: 'iconoir:cash', iconClass: 'bg-emerald-100 text-emerald-600', cardClass: 'border border-(--p-gray-5)' },
  { key: 'bankTransfer', title: 'ยอดเงินจาก QR Code ประจำวัน', icon: 'majesticons:qr-code-line', iconClass: 'bg-sky-100 text-sky-600', cardClass: 'border border-(--p-gray-5)' }
]

const STAT_CARDS: ICardConfig[] = [
  { key: 'totalOutstanding', title: 'ยอดหนี้คงเหลือ', icon: 'solar:wallet-linear', iconClass: 'bg-orange-100 text-orange-400', cardClass: 'border border-(--p-gray-5)' },
  { key: 'outstandingPrincipal', title: 'เงินต้นคงเหลือ', icon: 'solar:wallet-linear', iconClass: 'bg-orange-100 text-orange-400', cardClass: 'border border-(--p-gray-5)' },
  { key: 'outstandingInterest', title: 'ดอกเบี้ยคงเหลือ', icon: 'solar:wallet-linear', iconClass: 'bg-orange-100 text-orange-400', cardClass: 'border border-(--p-gray-5)' }
]
const authStore = useAuthStore()
const dayjs = useDayjs()

const DashboardService: IDashboardProvider = new DashboardProvider()

const branchId = ref<TBaseParamsId | null>(authStore.branch.id)
const marketingStart = ref<Date | string | null>(null)
const marketingEnd = ref<Date | string | null>(null)
const loanStart = ref<Date | string | null>(null)
const loanEnd = ref<Date | string | null>(null)

const cardData = ref<IDashboardCardData | null>(null)
const marketData = ref<IDashboardChartData | null>(null)
const loanData = ref<IDashboardChartData | null>(null)

const summaryCards = computed((): IDashboardCardItem[] => {
  if (!cardData.value) return []
  const d = cardData.value
  return SUMMARY_CARDS.map((card: ICardConfig): IDashboardCardItem => ({
    ...card,
    amount: formatter.numberFormatNoDecimal(d[card.key as keyof IDashboardCardData])
  }))
})

const statCards = computed((): IDashboardCardItem[] => {
  if (!cardData.value) return []
  const d = cardData.value
  return STAT_CARDS.map((card: ICardConfig): IDashboardCardItem => ({
    ...card,
    amount: formatter.numberFormatNoDecimal(d[card.key as keyof IDashboardCardData])
  }))
})

const marketingCenterValue = computed((): string => {
  return marketData.value ? formatter.numberFormatNoDecimal(marketData.value.total) : ''
})

const loanCenterValue = computed((): string => {
  return loanData.value ? formatter.numberFormatNoDecimal(loanData.value.total) : ''
})

const marketingRows = computed((): IDashboardDonutRow[] => {
  return (marketData.value?.items ?? []).map((item: IDashboardChartItem): IDashboardDonutRow => ({
    label: item.name,
    value: formatter.numberFormatNoDecimal(item.total),
    unit: CHART_MARKET_UNIT,
    percent: `${item.percent}%`
  }))
})

const loanRows = computed((): IDashboardDonutRow[] => {
  return (loanData.value?.items ?? []).map((item: IDashboardChartItem): IDashboardDonutRow => ({
    label: item.name,
    value: formatter.numberFormatNoDecimal(item.total),
    unit: CHART_LOAN_UNIT,
    percent: `${item.percent}%`
  }))
})

const loadCard = async (): Promise<void> => {
  const res = await DashboardService.getCard({ branchId: branchId.value })
  cardData.value = res.data
}

const loadChartMarket = async (): Promise<void> => {
  const res = await DashboardService.getChartMarket({
    branchId: branchId.value,
    startDate: dayjs.formatDateRequest(marketingStart.value ?? undefined),
    endDate: dayjs.formatDateRequest(marketingEnd.value ?? undefined)
  })
  marketData.value = res.data
}

const loadChartLoan = async (): Promise<void> => {
  const res = await DashboardService.getChartLoan({
    branchId: branchId.value,
    startDate: dayjs.formatDateRequest(loanStart.value ?? undefined),
    endDate: dayjs.formatDateRequest(loanEnd.value ?? undefined)
  })
  loanData.value = res.data
}

function fetchCard (): void {
  handleLoading(loadCard)
}
function fetchChartMarket (): void {
  handleLoading(loadChartMarket)
}
function fetchChartLoan (): void {
  handleLoading(loadChartLoan)
}

watch(branchId, (): void => {
  fetchCard()
  fetchChartMarket()
  fetchChartLoan()
})

watch((): (Date | string | null)[] => [marketingStart.value, marketingEnd.value], (): void => {
  fetchChartMarket()
}, { deep: true })

watch((): (Date | string | null)[] => [loanStart.value, loanEnd.value], (): void => {
  fetchChartLoan()
}, { deep: true })

onMounted((): void => {
  fetchCard()
  fetchChartMarket()
  fetchChartLoan()
})
</script>
