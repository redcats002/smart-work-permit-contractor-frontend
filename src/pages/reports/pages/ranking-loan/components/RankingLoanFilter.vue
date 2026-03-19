<template>
  <BaseTop>
    <div class="flex justify-center items-center gap-4">
      <div>
        ประจำเดือน
      </div>
      <div>
        <DatePickerInput
          v-model="model"
          date-format="mm/yy"
          view="month"
          @update:model-value="onSearch()" />
      </div>
    </div>
    <Spacer />
    <div class="flex gap-4">
      <SelectSortRankLoan v-model="filter.type" />
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IRankLendingFilter } from '@/models/modules/report/rank-lending/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import SelectSortRankLoan from './SelectSortRankLoan.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>({ default: '' })
const filter = defineModel<IRankLendingFilter>('filter', { default: (): IRankLendingFilter => ({ type: 'RECEIPT_AMOUNT' }) })

function onSearch (): void {
  emits('search')
}

</script>

<style scoped>

</style>
