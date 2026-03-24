<template>
  <BaseTop>
    <div class="flex justify-center items-center gap-4 ml-3">
      <div>
        ประจำเดือน
      </div>
      <div>
        <DatePickerInput
          v-model="model"
          date-format="MM yy"
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
// import LabelField from '@/components/input/LabelField.vue'
import type { IContractSecurityDocumentReportFilter } from '@/models/modules/report/contract-security-document/Filter.model'
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
defineModel<IContractSecurityDocumentReportFilter>('filters', { default: (): IContractSecurityDocumentReportFilter => ({}) })

function onSearch (): void {
  emits('search')
}


</script>

<style scoped>

</style>
