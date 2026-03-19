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
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IPercentInstallmentFilter } from '@/models/modules/report/percent-installment/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>({ default: '' })
defineModel<IPercentInstallmentFilter>('filter', { default: (): IPercentInstallmentFilter => ({}) })

function onSearch (): void {
  emits('search')
}

</script>

<style scoped>

</style>
