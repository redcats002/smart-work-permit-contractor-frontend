<template>
  <SelectInput
    v-model="innerModel"
    :invalid="invalid"
    :options="options"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search($event.query)" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { ProvinceItems, type TProvince } from '@/enums/modules/province/Province.enum'
import SelectInput from '@/components/input/SelectInput.vue'

interface IProps {
  invalid?: boolean
}

defineProps<IProps>()
const model = defineModel<TProvince | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)
const allSuggestions = ref<TBaseModel[]>([])
const options = ref<TBaseModel[]>([])

function loadSuggestions (): void {
  allSuggestions.value = ProvinceItems.map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item.label
  }))
  options.value = allSuggestions.value
}

function search (query: string): void {
  const q = query.trim().toLowerCase()
  options.value = q
    ? allSuggestions.value.filter((i: TBaseModel): boolean => i.name.toLowerCase().includes(q))
    : allSuggestions.value
}

function syncInnerFromValue (): void {
  if (model.value == null) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = allSuggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = (val?.id as TProvince) ?? null
  selectedName.value = val?.name ?? null
})

watch(model, (): void => {
  syncInnerFromValue()
})

watch(allSuggestions, (): void => {
  syncInnerFromValue()
}, { immediate: true })

onMounted((): void => {
  loadSuggestions()
})
</script>
