<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="'RECEIPT_AMOUNT'"
    :fetch-options="fetchOptions"
    :invalid="invalid"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { RankingLoanTypeItems, type TRankingLoanType } from '@/enums/modules/report/RankingLoan.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  invalid?: boolean
}

withDefaults(defineProps<IProps>(), {
  invalid: false
})
const attrs = useAttrs()

const modelValue = defineModel<TRankingLoanType>({ default: 'RECEIPT_AMOUNT' })
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (RankingLoanTypeItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TRankingLoanType => item?.id as TRankingLoanType
</script>

<style scoped></style>
