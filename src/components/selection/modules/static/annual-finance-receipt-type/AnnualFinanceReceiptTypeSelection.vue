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
import { AnnualFinanceReceiptTypeItems, type TAnnualFinanceReceiptType } from '@/enums/modules/report/annual-finance-receipt/AnnualFinanceReceipt.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  invalid?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TAnnualFinanceReceiptType>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (AnnualFinanceReceiptTypeItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TAnnualFinanceReceiptType | undefined => item?.id ? item.id as TAnnualFinanceReceiptType : undefined
</script>

<style scoped></style>
