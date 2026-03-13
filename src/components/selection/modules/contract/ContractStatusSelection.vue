<template>
  <AutoCompleteInput
    v-model="innerModel"
    :suggestions="suggestions"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { ContractStatusItems, type TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import usePagination from '@/composables/usePagination'

const model = defineModel<TContractStatus>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)

const { pagination } = usePagination()

const suggestions = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const items = ContractStatusItems

  suggestions.value = (items ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
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
  if (!model.value) {
    innerModel.value = null
    selectedName.value = null
    return
  }

  innerModel.value
    = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  if (!val) {
    model.value = '' as TContractStatus
    selectedName.value = null
    return
  }

  if (typeof val === 'string') {
    model.value = val as TContractStatus
    selectedName.value = suggestions.value.find((i: TBaseModel): boolean => i.id === val)?.name ?? null
    return
  }

  model.value = (val.id || '') as TContractStatus
  selectedName.value = val?.name ?? null
})

watch(model, (): void => {
  syncInnerFromId()
})

watch(
  suggestions, (): void => {
    syncInnerFromId()
  }, { immediate: true }
)

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
