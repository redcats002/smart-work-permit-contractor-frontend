<template>
  <SelectInput
    v-model="innerModel"
    :options="options"
    option-disabled="disabled"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search($event.query)" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { EvaluatorLevelItems, type TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import SelectInput from '@/components/input/SelectInput.vue'

interface IProps {
  disabledList?: TEvaluatorLevel[]
}

const props = withDefaults(defineProps<IProps>(), {
  disabledList: (): TEvaluatorLevel[] => []
})

const model = defineModel<TEvaluatorLevel>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)
const allSuggestions = ref<TBaseModel[]>([])
const options = ref<TBaseModel[]>([])

function loadSuggestions (): void {
  allSuggestions.value = EvaluatorLevelItems.map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item.label,
    disabled: props.disabledList.includes(item.value as TEvaluatorLevel)
  }))
  options.value = allSuggestions.value
}

function search (query: string): void {
  const q = query.trim().toLowerCase()
  options.value = q
    ? allSuggestions.value.filter((i: TBaseModel): boolean => i.name.toLowerCase().includes(q))
    : allSuggestions.value
}

function syncInnerFromId (): void {
  if (!model.value) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = allSuggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = (val?.id || '') as TEvaluatorLevel
  selectedName.value = val?.name ?? null
})

watch(model, (): void => {
  syncInnerFromId()
})

watch(allSuggestions, (): void => {
  syncInnerFromId()
}, { immediate: true })

watch((): TEvaluatorLevel[] => props.disabledList, (): void => {
  loadSuggestions()
})

onMounted((): void => {
  loadSuggestions()
})
</script>
