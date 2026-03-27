<template>
  <component
    :is="multiple ? MultiSelectInput : AutoCompleteInput"
    v-bind="attrs"
    v-model="innerModel"
    :complete-on-focus="!multiple ? completeOnFocus : undefined"
    :force-selection="!multiple ? forceSelection : undefined"
    :invalid="invalid"
    :option-label="optionLabel"
    :options="multiple ? suggestions : undefined"
    :placeholder="placeholderText"
    :show-clear="showClear"
    :suggestions="!multiple ? suggestions : undefined"
    option-disabled="disabled"
    @complete="search($event?.query)" />
</template>

<script setup lang="ts" generic="T">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import MultiSelectInput from '@/components/input/MultiSelectInput.vue'

interface IBaseSelectionProps<T> {
  invalid?: boolean
  multiple?: boolean
  placeholder?: string
  optionLabel?: string
  fetchSuggestions: () => Promise<T[]>
  completeOnFocus?: boolean
  forceSelection?: boolean
  showClear?: boolean
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<IBaseSelectionProps<T>>(), {
  placeholder: 'ทั้งหมด',
  optionLabel: 'name',
  completeOnFocus: true,
  forceSelection: true,
  multiple: false
})
const attrs = useAttrs()

const model = defineModel<any | any[] | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<any | any[] | null>(props.multiple ? [] : null)
const suggestions = ref<any[]>([])
const optionLabel = computed((): string => props.optionLabel ?? 'name')

const placeholderText = computed((): string | undefined => {
  if (props.placeholder) {
    if (Array.isArray(model.value) && model.value.length > 0) return undefined
    return props.placeholder
  }
  return undefined
})

async function fetch (): Promise<void> {
  suggestions.value = await props.fetchSuggestions()
}

async function search (query?: string): Promise<void> {
  await fetch()

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

function syncInnerFromId (): void {
  if (props.multiple) {
    const ids = Array.isArray(model.value) ? model.value.map((id: any): string => String(id)) : []
    const newItems = ids.length > 0
      ? suggestions.value.filter((i: any): boolean => ids.includes(String(i.id)))
      : []
    const current = Array.isArray(innerModel.value) ? innerModel.value : []
    if (current.length === newItems.length && current.every((item: any, i: number): boolean => item.id === newItems[i].id)) return
    innerModel.value = newItems
    return
  }
  if (model.value == null || Array.isArray(model.value)) {
    if (innerModel.value === null) return
    innerModel.value = null
    selectedName.value = null
    return
  }
  const found = suggestions.value.find((i: any): boolean => i.id === model.value) ?? null
  if ((innerModel.value as any | null)?.id === found?.id) return
  innerModel.value = found
  selectedName.value = found?.[optionLabel.value] ?? null
}

watch(innerModel, (val: any | any[] | null): void => {
  if (props.multiple) {
    const items = Array.isArray(val) ? val : []
    const newIds = items.filter(Boolean).map((item: any): string => item.id ? String(item.id) : '')
    const currentIds = Array.isArray(model.value) ? model.value.map((id: any): string => String(id)) : []
    if (newIds.length === currentIds.length && newIds.every((id: any, i: number): boolean => String(id) === currentIds[i])) return
    model.value = newIds
    return
  }
  const item = val as any | null
  model.value = item?.id ? String(item.id) : null
  selectedName.value = item?.[optionLabel.value] ?? null
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

<style scoped></style>
