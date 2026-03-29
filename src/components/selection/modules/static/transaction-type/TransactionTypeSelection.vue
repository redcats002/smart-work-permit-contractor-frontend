<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-options="fetchOptions"
    :invalid="props.invalid"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { TransactionTypeItems, type TTransactionType } from '@/enums/modules/report/branch-income-expense/TransactionType.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  invalid?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TTransactionType>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (TransactionTypeItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TTransactionType | undefined => item?.id ? item.id as TTransactionType : undefined
</script>

<style scoped></style>
