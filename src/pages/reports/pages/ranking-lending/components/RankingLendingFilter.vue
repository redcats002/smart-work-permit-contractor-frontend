<template>
  <BaseTop>
    <div class="flex items-center gap-4">
      <DatePickerInput
        v-model="model"
        date-format="MM yy"
        view="month"
        @update:model-value="onSearch($event)" />
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { IRankLendingFilter } from '@/models/modules/report/rank-lending/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'

interface IEmits {
  search: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = ref<Date | null>(new Date())
const filters = defineModel<IRankLendingFilter>('filters', { default: (): IRankLendingFilter => ({}) })

function onSearch (val: Date | Date[] | string | string[] | null | undefined): void {
  const base = dayjs(val instanceof Date ? val : new Date())
  filters.value.startDate = base.startOf('month').format('YYYY-MM-DD')
  filters.value.endDate = base.endOf('month').format('YYYY-MM-DD')
  emits('search')
}
</script>

<style scoped></style>
