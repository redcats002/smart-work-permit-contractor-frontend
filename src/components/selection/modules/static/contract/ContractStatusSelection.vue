<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="''"
    :fetch-options="fetchOptions"
    :is-empty-model-value="isEmptyModelValue"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { ContractStatusItems, type TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

const attrs = useAttrs()

const modelValue = defineModel<TContractStatus | ''>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (ContractStatusItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TContractStatus | '' => String(item?.id ?? '') as TContractStatus | ''
const isEmptyModelValue = (value: TContractStatus | '' | null | undefined): boolean => !value
</script>

<style scoped></style>
