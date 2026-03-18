<template>
  <AutoCompleteInput
    v-model="innerModel"
    :suggestions="suggestions"
    option-label="name"
    option-value="id"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IFinanceIncomeCategoryList } from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import FinanceIncomeCategoryProvider, { type IFinanceIncomeCategoryProvider } from '@/resources/provider/finance-income-category/FinanceIncomeCategory.provider'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import usePagination from '@/composables/usePagination'

const FinanceIncomeCategoryService: IFinanceIncomeCategoryProvider = new FinanceIncomeCategoryProvider()

const model = defineModel<number | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)
const { pagination } = usePagination()
const suggestions = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const response = await FinanceIncomeCategoryService.getFinanceIncomeCategoryPaginate({
    page: pagination.value.page,
    limit: 9999
  })
  suggestions.value = (response.data ?? []).map((item: IFinanceIncomeCategoryList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}

function fetch (): void {
  handleLoading(useFetch)
}

function search (): void {
  pagination.value.page = 1
  fetch()
}

function syncInnerFromId (): void {
  if (model.value == null) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = val?.id ? Number(val.id) : null
  selectedName.value = val?.name ?? null
})
watch(model, (): void => {
  syncInnerFromId()
})
watch(suggestions, (): void => {
  syncInnerFromId()
}, { immediate: true })

onMounted((): void => {
  fetch()
})
</script>
