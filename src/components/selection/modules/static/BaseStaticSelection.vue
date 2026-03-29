<template>
  <SelectInput
    v-bind="attrs"
    v-model="innerModel"
    :complete-on-focus="completeOnFocus"
    :force-selection="forceSelection"
    :invalid="invalid"
    :option-disabled="optionDisabled"
    :option-label="optionLabel"
    :options="options"
    :placeholder="placeholder"
    @complete="search($event?.query)" />
</template>

<script setup lang="ts" generic="TOption, TModel = unknown">
import { computed, onMounted, ref, type Ref, useAttrs, watch } from 'vue'
import SelectInput from '@/components/input/SelectInput.vue'

interface IProps<TOption, TModel> {
  invalid?: boolean
  placeholder?: string
  optionLabel?: string
  optionDisabled?: string
  completeOnFocus?: boolean
  forceSelection?: boolean
  fetchOptions: (query?: string) => Promise<TOption[]>
  mapOptionToModel?: (item: TOption) => TModel
  getOptionValue?: (item: TOption) => unknown
  getOptionLabel?: (item: TOption) => string
  refreshDeps?: unknown[]
  emptyModelValue?: TModel | null | undefined
  isEmptyModelValue?: (value: TModel | null | undefined) => boolean
  localFilter?: boolean
  filterOptions?: (items: TOption[], query: string) => TOption[]
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<IProps<TOption, TModel>>(), {
  invalid: false,
  placeholder: undefined,
  optionLabel: undefined,
  optionDisabled: undefined,
  completeOnFocus: true,
  forceSelection: true,
  mapOptionToModel: undefined,
  getOptionValue: undefined,
  getOptionLabel: undefined,
  refreshDeps: undefined,
  emptyModelValue: undefined,
  isEmptyModelValue: undefined,
  localFilter: false,
  filterOptions: undefined
})

const attrs = useAttrs()

const model = defineModel<TModel | null | undefined>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TOption | null>(null) as Ref<TOption | null>
const allOptions = ref<TOption[]>([]) as Ref<TOption[]>
const options = ref<TOption[]>([]) as Ref<TOption[]>

const emptyModelValue = computed((): TModel | null | undefined => props.emptyModelValue)

function getInnerOptionValue (item: TOption | null | undefined): unknown {
  if (item == null) return null
  if (props.getOptionValue) return props.getOptionValue(item)
  if (typeof item === 'object' && 'id' in (item as Record<string, unknown>)) {
    return (item as Record<string, unknown>).id
  }
  return item
}

function getOptionText (item: TOption | null | undefined): string | null {
  if (item == null) return null
  if (props.getOptionLabel) return props.getOptionLabel(item)
  if (props.optionLabel && typeof item === 'object' && props.optionLabel in (item as Record<string, unknown>)) {
    return String((item as Record<string, unknown>)[props.optionLabel] ?? '')
  }
  return String(item)
}

function mapInnerOptionToModel (item: TOption): TModel | unknown {
  return props.mapOptionToModel?.(item) ?? getInnerOptionValue(item)
}

function isInnerEmptyModelValue (value: TModel | null | undefined): boolean {
  return props.isEmptyModelValue?.(value) ?? value == null
}

function applyFilter (items: TOption[], query?: string): TOption[] {
  const normalizedQuery = query?.trim().toLowerCase()

  if (!normalizedQuery) return items
  if (props.filterOptions) return props.filterOptions(items, normalizedQuery)

  return items.filter((item: TOption): boolean => {
    const label = getOptionText(item)
    return String(label ?? '')
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

async function fetch (): Promise<void> {
  const fetched = await props.fetchOptions()
  allOptions.value = fetched
  options.value = fetched
}

async function search (query?: string): Promise<void> {
  if (props.localFilter) {
    options.value = applyFilter(allOptions.value, query)
    return
  }

  const fetched = await props.fetchOptions(query)
  allOptions.value = fetched
  options.value = fetched
}

function syncInnerFromModel (): void {
  if (isInnerEmptyModelValue(model.value)) {
    innerModel.value = null
    selectedName.value = null
    return
  }

  const found = allOptions.value.find((item: TOption): boolean => String(getInnerOptionValue(item)) === String(model.value)) ?? null

  innerModel.value = found
  selectedName.value = getOptionText(found)
}

watch(innerModel, (value: TOption | null): void => {
  if (value == null) {
    model.value = emptyModelValue.value
    selectedName.value = null
    return
  }

  model.value = mapInnerOptionToModel(value as TOption) as TModel
  selectedName.value = getOptionText(value as TOption)
})

watch(model, (): void => {
  syncInnerFromModel()
})

watch(
  options, (): void => {
    syncInnerFromModel()
  }, { immediate: true }
)

watch(
  (): unknown[] | undefined => props.refreshDeps, (): void => {
    fetch()
  }, { deep: true }
)

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
