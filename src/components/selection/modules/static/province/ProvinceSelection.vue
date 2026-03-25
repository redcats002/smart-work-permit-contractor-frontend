<template>
  <SelectInput
    v-model="innerModel"
    :invalid="invalid"
    :options="options"
    complete-on-focus
    force-selection
    @complete="search($event.query)" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TBaseOption } from '@/models/Global.model'
import { ProvinceItems, type TProvince } from '@/enums/modules/province/Province.enum'
import SelectInput from '@/components/input/SelectInput.vue'

interface IProps {
  invalid?: boolean
}

defineProps<IProps>()
const model = defineModel<TProvince | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<string | null>(null)
const allSuggestions = ref<string[]>([])
const options = ref<string[]>([])

function loadSuggestions (): void {
  allSuggestions.value = ProvinceItems.map((item: TBaseOption): string => item.label)
  options.value = allSuggestions.value
}

function search (query: string): void {
  const q = query.trim().toLowerCase()
  options.value = q
    ? allSuggestions.value.filter((i: string): boolean => i.toLowerCase().includes(q))
    : allSuggestions.value
}

function syncInnerFromValue (): void {
  if (model.value == null) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = allSuggestions.value.find((i: string): boolean => i === model.value) ?? null
  selectedName.value = innerModel.value ?? null
}

watch(innerModel, (val: string | null): void => {
  model.value = (val as TProvince) ?? null
  selectedName.value = val ?? null
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
