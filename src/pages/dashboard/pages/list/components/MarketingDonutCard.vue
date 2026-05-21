<template>
  <div class="w-full h-full bg-white border border-(--p-gray-5) rounded-xl p-6 shadow-sm">
    <div>
      <div class="text-base font-semibold text-surface-900">
        {{ title }}
      </div>
      <div class="mt-2 text-sm text-surface-600 flex items-center gap-2">
        <span class="whitespace-nowrap font-semibold">{{ periodLabel }}</span>
        <div class="w-70 flex-none">
          <DatePickerInput
            v-model:end="endDate"
            v-model:start="startDate"
            :manual-input="false"
            class="w-full"
            date-format="MM yy"
            icon-display="input"
            icon-position="prepend"
            input-class="w-full !pl-3"
            input-icon-class="text-surface-600"
            placeholder="เลือกช่วงเวลา"
            selection-mode="range"
            view="month" />
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6">
      <div class="flex items-center justify-center">
        <div class="relative w-52 h-52">
          <ChartJsDonut
            :items="donutItems"
            aria-label="Donut chart" />
          <div class="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center">
            <div class="text-xl font-semibold text-surface-900">
              {{ centerValue }}
            </div>
            <div class="text-sm text-surface-600">
              {{ centerUnit }}
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <template v-if="rows.length">
          <DonutRowItem
            v-for="(row, i) in rows"
            :key="`${row.label}-${i}`"
            :color="donutColorMap[row.label]"
            :label="row.label"
            :percent="row.percent"
            :unit="row.unit"
            :value="row.value" />
          <div
            v-if="showSummary"
            class="border-t border-(--p-gray-5) pt-2 flex items-center justify-between text-sm">
            <div class="font-bold text-[#333]">
              รวม
            </div>
            <div class="font-bold text-[#333]">
              {{ computedTotal }} {{ rows[0]?.unit ?? '' }}
            </div>
          </div>
        </template>
        <Empty v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IDashboardDonutRow } from '@/models/modules/dashboard/Dashboard.model'
import ChartJsDonut, { type DonutItem } from '@/components/charts/ChartJsDonut.vue'
import Empty from '@/components/display/Empty.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import DonutRowItem from './DonutRowItem.vue'

interface Props {
  title: string
  periodLabel: string
  centerValue: string
  centerUnit: string
  rows: IDashboardDonutRow[]
  showSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSummary: false
})

const DONUT_COLORS = ['#72D9C8', '#52AED5', '#F4D67E', '#F46A67', '#FFABB1', '#374153', '#FE8A8A']

const startDate = defineModel<Date | string | null | undefined>('start')
const endDate = defineModel<Date | string | null | undefined>('end')

const donutColorMap = computed((): Record<string, string> => {
  return Object.fromEntries(
    donutItems.value.map((item: DonutItem): [string, string] => [
      item.label,
      item.color ?? DONUT_COLORS[0]
    ])
  )
})

const parsePercent = (value: string): number => {
  const normalized = value.replace('%', '').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const parseValue = (value: string): number => {
  const normalized = value.replace(/,/g, '').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const donutItems = computed<DonutItem[]>((): DonutItem[] => {
  return props.rows.map((row: IDashboardDonutRow, i: number): DonutItem => ({
    label: row.label,
    value: parsePercent(row.percent),
    color: DONUT_COLORS[i % DONUT_COLORS.length]
  }))
})

const computedTotal = computed<string>((): string => {
  const total = props.rows.reduce((sum: number, row: IDashboardDonutRow): number => {
    return sum + parseValue(row.value)
  }, 0)
  return total.toLocaleString('en-US')
})
</script>
