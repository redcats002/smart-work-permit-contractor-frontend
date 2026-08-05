<template>
  <component
    :is="multiple ? MultiSelectInput : AutoCompleteInput"
    v-bind="attrs"
    v-model="innerModel"
    :complete-on-focus="!multiple ? completeOnFocus : undefined"
    :force-selection="!multiple ? forceSelection : undefined"
    :invalid="invalid"
    :option-disabled="!multiple ? isOptionDisabled : undefined"
    :option-label="optionLabel"
    :options="multiple ? suggestions : undefined"
    :placeholder="placeholderText"
    :show-clear="showClear"
    :suggestions="!multiple ? suggestions : undefined"
    @complete="search($event?.query)" />
</template>

<script setup lang="ts" generic="T extends TBaseModel">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import type { TBaseModel } from '@/models/Global.model'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import MultiSelectInput from '@/components/input/MultiSelectInput.vue'

interface IBaseSelectionProps<T> {
  invalid?: boolean
  multiple?: boolean
  placeholder?: string
  optionLabel?: string
  fetchSuggestions: (query?: string) => Promise<T[]>
  completeOnFocus?: boolean
  forceSelection?: boolean
  showClear?: boolean
  mapOptionToModel?: (item: T) => any
  getOptionValue?: (item: T) => any
  refreshDeps?: unknown[]
  emptyModelValue?: any
  isEmptyModelValue?: (value: any) => boolean
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<IBaseSelectionProps<T>>(), {
  placeholder: 'ทั้งหมด',
  optionLabel: 'name',
  completeOnFocus: true,
  forceSelection: true,
  multiple: false,
  mapOptionToModel: undefined,
  getOptionValue: undefined,
  refreshDeps: undefined,
  emptyModelValue: undefined,
  isEmptyModelValue: undefined
})
const attrs = useAttrs()

const model = defineModel<any | any[] | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<any | any[] | null>(props.multiple ? [] : null)
const suggestions = ref<any[]>([])
const cache = new Map<string, any[]>()
const optionLabel = computed((): string => props.optionLabel ?? 'name')
const getOptionValue = (item: T): any => props.getOptionValue?.(item) ?? (item as any)?.id
const mapOptionToModel = (item: T): any => props.mapOptionToModel?.(item) ?? getOptionValue(item)
const emptyModelValue = computed((): any => props.emptyModelValue ?? null)
const isEmptyModelValue = (value: any): boolean => props.isEmptyModelValue?.(value) ?? value == null

const placeholderText = computed((): string | undefined => {
  if (props.placeholder) {
    if (Array.isArray(model.value) && model.value.length > 0) return undefined
    return props.placeholder
  }
  return undefined
})

async function fetch (query?: string): Promise<void> {
  const key = query ?? ''
  if (cache.has(key)) {
    suggestions.value = [...cache.get(key)!]
    return
  }
  const result = await props.fetchSuggestions(query)
  cache.set(key, result)
  suggestions.value = result
}

async function search (query?: string): Promise<void> {
  await fetch(query)

  const normalizedQuery = query?.trim().toLowerCase()

  if (!normalizedQuery) return

  const matched = suggestions.value.filter((item: any): boolean => {
    const label = String(item?.[optionLabel.value] ?? '').toLowerCase()
    return label.includes(normalizedQuery)
  })

  if (matched.length === 0) return

  const unmatched = suggestions.value.filter((item: any): boolean => !matched.includes(item))
  suggestions.value = [...matched, ...unmatched]
}

function isOptionDisabled (option: T): boolean {
  if (props.multiple) return false
  if (option?.disabled) return true
  const currentValue = mapOptionToModel(option)
  const selectedValue = model.value
  return currentValue !== null && selectedValue !== null && String(currentValue) === String(selectedValue)
}

function syncInnerFromId (): void {
  if (props.multiple) {
    const ids = Array.isArray(model.value) ? model.value.map((id: any): string => String(id)) : []
    const newItems = ids.length > 0 ? suggestions.value.filter((item: T): boolean => ids.includes(String(getOptionValue(item)))) : []
    const current = Array.isArray(innerModel.value) ? innerModel.value : []
    if (
      current.length === newItems.length
      && current.every((item: T, i: number): boolean => String(getOptionValue(item)) === String(getOptionValue(newItems[i])))
    )
      return
    innerModel.value = newItems
    return
  }
  if (isEmptyModelValue(model.value) || Array.isArray(model.value)) {
    if (innerModel.value === null || innerModel.value === emptyModelValue.value) return
    innerModel.value = null
    selectedName.value = null
    return
  }
  const found = suggestions.value.find((item: T): boolean => String(getOptionValue(item)) === String(model.value)) ?? null
  if (String(getOptionValue(innerModel.value as T)) === String(getOptionValue(found as T))) return
  innerModel.value = found
  selectedName.value = found?.[optionLabel.value] ?? null
}

watch(innerModel, (val: any | any[] | null): void => {
  if (props.multiple) {
    const items = Array.isArray(val) ? val : []
    const newIds = items.filter(Boolean).map((item: T): any => mapOptionToModel(item))
    const currentIds = Array.isArray(model.value) ? model.value.map((id: any): string => String(id)) : []
    if (newIds.length === currentIds.length && newIds.every((id: any, i: number): boolean => String(id) === currentIds[i])) return
    model.value = newIds
    return
  }
  const item = val as any | null
  model.value = item ? mapOptionToModel(item) : emptyModelValue.value
  selectedName.value = item?.[optionLabel.value] ?? null
})

watch(model, (): void => {
  syncInnerFromId()
})

watch(
  suggestions, (): void => {
    syncInnerFromId()
  }, { immediate: true }
)

watch(
  (): unknown[] | undefined => props.refreshDeps, (): void => {
    cache.clear()
    model.value = props.multiple ? [] : emptyModelValue.value
    innerModel.value = props.multiple ? [] : null
    selectedName.value = null
    suggestions.value = []
    fetch()
  }, { deep: true }
)

onMounted((): void => {
  const hasValue = !isEmptyModelValue(model.value) && model.value !== ''
  if (!hasValue) return
  fetch(hasValue && selectedName.value ? selectedName.value : undefined)
})
</script>

<style scoped></style>
