<template>
  <BaseTop>
    <div class="relative w-52">
      <DatePickerInput
        v-model="month"
        date-format="' '"
        view="month"
        @update:model-value="onMonthChange()" />
      <span class="absolute left-3 right-10 top-1/2 -translate-y-1/2 text-sm pointer-events-none truncate">
        {{ monthLabel || 'เลือกเดือน' }}
      </span>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IGetDailySummaryList } from '@/models/request/report/daily-summary/DailySummary.model'
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'

interface IEmits {
  search: []
}

const emits = defineEmits<IEmits>()

const filter = defineModel<IGetDailySummaryList>('filters', { default: (): IGetDailySummaryList => ({}) })

const dayjs = useDayjs()
const month = ref<Date | null>(new Date())

const THAI_MONTHS: string[] = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const monthLabel = computed((): string => {
  if (!month.value) return ''
  const d = dayjs(month.value)
  return `${THAI_MONTHS[d.month()]} ${d.year() + 543}`
})

function setFilter (): void {
  if (!month.value) {
    filter.value = {}
    return
  }
  filter.value = {
    startDate: dayjs(month.value).startOf('month').toISOString(),
    endDate: dayjs(month.value).endOf('month').toISOString()
  }
}

function onMonthChange (): void {
  setFilter()
  emits('search')
}

onMounted((): void => {
  setFilter()
})
</script>

<style scoped></style>
