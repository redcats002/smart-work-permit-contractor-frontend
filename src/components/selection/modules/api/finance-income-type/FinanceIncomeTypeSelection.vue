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
    :refresh-deps="refreshDeps"
    option-label="name" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IFinanceIncomeTypeList } from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import FinanceIncomeTypeProvider, { type IFinanceIncomeTypeProvider } from '@/resources/provider/finance-income-type/FinanceIncomeType.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  incomeCategoryId?: number | null
}

const props = defineProps<IProps>()
const attrs = useAttrs()
const FinanceIncomeTypeService: IFinanceIncomeTypeProvider = new FinanceIncomeTypeProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination()

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await FinanceIncomeTypeService.getFinanceIncomeTypePaginate({
    page: pagination.value.page,
    limit: 9999,
    incomeCategoryId: props.incomeCategoryId ?? undefined
  })

  return (response.data ?? []).map((item: IFinanceIncomeTypeList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
const refreshDeps = computed((): unknown[] => [props.incomeCategoryId])
</script>

<style scoped></style>
