<template>
  <div
    :style="cardStyle"
    class="w-full h-full bg-white border border-(--p-gray-5) rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm font-semibold text-surface-900">
          {{ title }}
        </div>
        <div class="mt-2 text-sm text-surface-600 flex items-center gap-2 whitespace-nowrap min-w-[760px]">
          <span class="whitespace-nowrap">{{ periodLabel }}</span>
          <div class="w-[250px] flex-none">
            <DatePickerInput
              v-model:end="endDate"
              v-model:start="startDate"
              :manual-input="false"
              class="w-full"
              date-format="MM yy"
              icon-display="input"
              input-class="w-full !pl-3"
              input-icon-class="text-surface-600"
              selection-mode="range"
              view="month" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" />
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex items-center justify-center">
        <div class="relative w-52 h-52">
          <ChartJsDonut
            :items="donutItems"
            aria-label="Marketing donut chart" />
          <div class="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center">
            <div class="text-xl font-semibold text-surface-900">
              {{ totalAmount }}
            </div>
            <div class="text-sm text-surface-600">
              บาท
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="row in rows"
          :key="row.label"
          class="flex items-center justify-between text-sm text-surface-700">
          <div>{{ row.label }}</div>
          <div class="font-semibold text-surface-900">
            {{ row.count }} ราย {{ row.percent }}
          </div>
        </div>
        <div class="border-t border-(--p-gray-5) pt-3 flex items-center justify-between text-sm">
          <div class="font-semibold text-surface-900">
            รวม
          </div>
          <div class="font-semibold text-surface-900">
            {{ computedTotalCount }} ราย
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartJsDonut, { type DonutItem } from '@/components/charts/ChartJsDonut.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import { computed } from 'vue'

interface MarketingRow {
  label: string
  count: string
  percent: string
}

interface Props {
  title: string
  periodLabel: string
  totalAmount: string
  totalCount: string
  rows: MarketingRow[]
  cardStyle?: Record<string, string>
}

const props = defineProps<Props>()

const startDate = defineModel<Date | string | null | undefined>('start')
const endDate = defineModel<Date | string | null | undefined>('end')

const parseCount = (value: string): number => {
  const normalized = value.replace(/,/g, '').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const parsePercent = (value: string): number => {
  const normalized = value.replace('%', '').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const donutItems = computed<DonutItem[]>((): DonutItem[] => {
  return props.rows.map((row: MarketingRow): DonutItem => {
    return {
      label: row.label,
      value: parsePercent(row.percent)
    }
  })
})

const computedTotalCount = computed<string>((): string => {
  const total = props.rows.reduce((sum: number, row: MarketingRow): number => {
    return sum + parseCount(row.count)
  }, 0)
  return total.toLocaleString('en-US')
})
</script>
