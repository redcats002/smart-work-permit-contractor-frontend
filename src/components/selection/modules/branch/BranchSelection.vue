<template>
  <MultiSelectInput
    v-if="isMultiple"
    v-bind="attrs"
    v-model="innerModel"
    :invalid="invalid"
    :options="suggestions"
    :placeholder="placeholderText"
    option-label="name" />
  <AutoCompleteInput
    v-else
    v-bind="attrs"
    v-model="innerModel"
    :invalid="invalid"
    :placeholder="placeholderText"
    :suggestions="suggestions"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IBranchProvider } from '@/resources/provider/branch/Branch.provider'
import BranchProvider from '@/resources/provider/branch/Branch.provider'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import MultiSelectInput from '@/components/input/MultiSelectInput.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  invalid?: boolean
  multiple?: boolean
  placeholder?: string
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps<IProps>()
const attrs = useAttrs()

const BranchService: IBranchProvider = new BranchProvider()

const model = defineModel<TBaseParamsId | TBaseParamsId[] | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const isMultiple = computed((): boolean => Boolean(props.multiple))
const innerModel = ref<TBaseModel | TBaseModel[] | null>(isMultiple.value ? [] : null)

const { pagination } = usePagination()

const suggestions = ref<TBaseModel[]>([])
const placeholderText = computed((): string | undefined => {
  if (props.placeholder) {
    if (Array.isArray(model.value) && model.value.length > 0) return undefined
    return props.placeholder
  }
  return undefined
})
async function useFetch (): Promise<void> {
  const response = await BranchService.getBranchPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  suggestions.value = (response.data ?? [])
    .filter((item: IBranchList): boolean => item.id !== undefined && item.name !== undefined)
    .map((item: IBranchList): TBaseModel => ({
      id: item.id ?? null,
      name: item.name ?? ''
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
  if (isMultiple.value) {
    const ids = Array.isArray(model.value) ? model.value.map((id: TBaseParamsId): string => String(id)) : []
    const newItems = ids.length > 0
      ? suggestions.value.filter((i: TBaseModel): boolean => ids.includes(String(i.id)))
      : []
    const current = Array.isArray(innerModel.value) ? innerModel.value : []
    if (current.length === newItems.length && current.every((item: TBaseModel, i: number): boolean => item.id === newItems[i].id)) return
    innerModel.value = newItems
    return
  }
  if (model.value == null || Array.isArray(model.value)) {
    if (innerModel.value === null) return
    innerModel.value = null
    selectedName.value = null
    return
  }
  const found = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  if ((innerModel.value as TBaseModel | null)?.id === found?.id) return
  innerModel.value = found
  selectedName.value = found?.name ?? null
}

watch(innerModel, (val: TBaseModel | TBaseModel[] | null): void => {
  if (isMultiple.value) {
    const items = Array.isArray(val) ? val : []
    const newIds = items.filter(Boolean).map((item: TBaseModel): string => item.id ? String(item.id) : '') as TBaseParamsId[]
    const currentIds = Array.isArray(model.value) ? model.value.map((id: TBaseParamsId): string => String(id)) : []
    if (newIds.length === currentIds.length && newIds.every((id: TBaseParamsId, i: number): boolean => String(id) === currentIds[i])) return
    model.value = newIds
    return
  }
  const item = val as TBaseModel | null
  model.value = item?.id ? String(item.id) : null
  selectedName.value = item?.name ?? null
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
