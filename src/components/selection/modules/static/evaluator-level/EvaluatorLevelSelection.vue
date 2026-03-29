<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-options="fetchOptions"
    :filter-options="filterOptions"
    :map-option-to-model="mapOptionToModel"
    :refresh-deps="[props.existedGroup]"
    option-disabled="disabled"
    option-label="name"
    local-filter />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { EvaluatorLevelItems, EvaluatorLevelPriority, type TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  existedGroup?: TEvaluatorLevel[]
}

const props = withDefaults(defineProps<IProps>(), {
  existedGroup: (): TEvaluatorLevel[] => []
})
const attrs = useAttrs()

const modelValue = defineModel<TEvaluatorLevel>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

function isLevelDisabled (level: TEvaluatorLevel): boolean {
  const priority = EvaluatorLevelPriority[level]
  return props.existedGroup.some(
    (existed: TEvaluatorLevel): boolean => EvaluatorLevelPriority[existed] < priority
  )
}

const fetchOptions = async (): Promise<TBaseModel[]> => EvaluatorLevelItems.map((item: TBaseOption): TBaseModel => ({
  id: item.value!,
  name: item.label,
  disabled: isLevelDisabled(item.value as TEvaluatorLevel)
}))

function filterOptions (items: TBaseModel[], query: string): TBaseModel[] {
  return items.filter((item: TBaseModel): boolean => item.name.toLowerCase().includes(query))
}

const mapOptionToModel = (item: TBaseModel): TEvaluatorLevel => String(item?.id ?? '') as TEvaluatorLevel
</script>

<style scoped></style>
