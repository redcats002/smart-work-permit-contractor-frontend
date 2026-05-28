<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    :fetch-options="fetchOptions"
    :map-option-to-model="mapOptionToModel"
    :refresh-deps="[props.reportType]"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import {
  REPORT_TYPE_COL1_LABEL,
  REPORT_TYPE_COL2_LABEL,
  ReportTypeEnum,
  type TReportType
} from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import type { TBaseModel } from '@/models/Global.model'
import type { TBranchIncomeExpenseCategoryFilter } from '@/models/modules/report/branch-income-expense/Filter.model'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  reportType?: TReportType
}

const props = withDefaults(defineProps<IProps>(), {
  reportType: ReportTypeEnum.RECEIVE_REFUND
})

const attrs = useAttrs()
const modelValue = defineModel<TBranchIncomeExpenseCategoryFilter>()

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const rt = props.reportType || ReportTypeEnum.RECEIVE_REFUND
  return [
    { id: 'OVERALL', name: 'สรุปรวม' },
    { id: 'COL1', name: REPORT_TYPE_COL1_LABEL[rt] },
    { id: 'COL2', name: REPORT_TYPE_COL2_LABEL[rt] }
  ]
}) ?? []

const mapOptionToModel = (item: TBaseModel): TBranchIncomeExpenseCategoryFilter | undefined =>
  item?.id ? item.id as TBranchIncomeExpenseCategoryFilter : undefined
</script>

<style scoped></style>
