<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-options="fetchOptions"
    :filter-options="filterOptions"
    :get-option-label="getOptionLabel"
    :get-option-value="getOptionValue"
    :invalid="props.invalid"
    local-filter />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import type { TBaseOption } from '@/models/Global.model'
import { ProvinceItems, type TProvince } from '@/enums/modules/province/Province.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  invalid?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TProvince | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<string[]> => ProvinceItems.map((item: TBaseOption): string => item.label)

function filterOptions (items: string[], query: string): string[] {
  return items.filter((item: string): boolean => item.toLowerCase().includes(query))
}

const getOptionLabel = (item: string): string => item
const getOptionValue = (item: string): string => item
</script>

<style scoped></style>
