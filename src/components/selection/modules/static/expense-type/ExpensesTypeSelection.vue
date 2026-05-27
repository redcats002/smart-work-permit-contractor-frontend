<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="undefined"
    :fetch-options="fetchOptions"
    :map-option-to-model="mapOptionToModel"
    :refresh-deps="[modelValue]"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import {
  ExpensesTypeCapitalItems,
  ExpensesTypePaymentItems,
  ExpenseTypeItems,
  isCapitalExpense,
  isPaymentExpense,
  type TExpensesType
} from '@/enums/modules/finance/ExpenseType.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

const attrs = useAttrs()

const modelValue = defineModel<TExpensesType>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

function itemsForType (): TBaseOption[] {
  if (isCapitalExpense(modelValue.value)) return ExpensesTypeCapitalItems
  if (isPaymentExpense(modelValue.value)) return ExpensesTypePaymentItems
  return ExpenseTypeItems
}


const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (itemsForType() ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TExpensesType | undefined => item?.id ? item.id as TExpensesType : undefined
</script>

<style scoped></style>
