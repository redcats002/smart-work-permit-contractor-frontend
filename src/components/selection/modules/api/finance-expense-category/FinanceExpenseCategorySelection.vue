<template>
  <BaseSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-suggestions="fetchSuggestions"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IFinanceExpenseCategoryList } from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import FinanceExpenseCategoryProvider, {
  type IFinanceExpenseCategoryProvider
} from '@/resources/provider/finance-expense-category/FinanceIncomeCategory.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

const attrs = useAttrs()
const FinanceExpenseCategoryService: IFinanceExpenseCategoryProvider = new FinanceExpenseCategoryProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await FinanceExpenseCategoryService.getFinanceExpenseCategoryPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: IFinanceExpenseCategoryList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
