<template>
  <SelectInput
    v-model="model"
    :options="FinancialSummaryTypeItems"
    option-label="label"
    option-value="value" />
</template>

<script setup lang="ts">
import { FinancialSummaryTypeItems, type TFinancialSummaryType } from '@/enums/modules/report/financial-summary/FinancialSummaryType.enum'
import SelectInput from '@/components/input/SelectInput.vue'

const model = defineModel<TFinancialSummaryType>({ default: 'SUMMARY' })
</script>

<style scoped></style>
