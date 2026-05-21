<template>
  <BaseSelection
    v-bind="{
      ...props,
      ...attrs
    }"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-suggestions="fetchSuggestions"
    :map-option-to-model="mapOptionToModel"
    :refresh-deps="[expenseCategoryId]"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IFinanceExpenseTypeList } from '@/models/response/finance-expense-type/FinanceExpenseTypeRes.model'
import FinanceExpenseTypeProvider, { type IFinanceExpenseTypeProvider } from '@/resources/provider/finance-expense-type/FinanceIncomeType.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  expenseCategoryId?: number | null
}

const props = defineProps<IProps>()
const attrs = useAttrs()
const FinanceExpenseTypeService: IFinanceExpenseTypeProvider = new FinanceExpenseTypeProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await FinanceExpenseTypeService.getFinanceExpenseTypePaginate({
    page: pagination.value.page,
    limit: 9999,
    expenseCategoryId: props.expenseCategoryId ?? undefined
  })

  return (response.data ?? []).map((item: IFinanceExpenseTypeList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
