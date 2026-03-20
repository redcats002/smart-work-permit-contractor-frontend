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
          <div class="absolute inset-0 rounded-full dashboard-donut" />
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
            {{ totalCount }} ราย
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DatePickerInput from '@/components/input/DatePickerInput.vue'

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

defineProps<Props>()

const startDate = defineModel<Date | string | null | undefined>('start')
const endDate = defineModel<Date | string | null | undefined>('end')
</script>

<style scoped>
.dashboard-donut {
  background:
    conic-gradient(
      #7f0d0d 0deg 70deg,
      #b81818 70deg 140deg,
      #ff2b2b 140deg 210deg,
      #ff5a5a 210deg 260deg,
      #ff8c8c 260deg 300deg,
      #ffc1c1 300deg 330deg,
      #ffdede 330deg 360deg
    );
}
</style>
