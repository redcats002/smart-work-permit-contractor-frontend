<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IEvaluatorList } from '@/models/modules/pre-contract/Evaluator.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle, type TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  count: number
  evaluatorLevel: TEvaluatorLevel
  items: IEvaluatorList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = computed((): IColumn<IEvaluatorList>[] => [
  { field: 'firstName', header: 'ชื่อผู้ตีราคา รอบที่ 1', value: (e: IEvaluatorList): string => formatter.fullName(e?.evaluator) },
  { field: 'evaluatorLevel', header: 'กลุ่มผู้ตีราคา', value: (): string => formatTitle(props.evaluatorLevel) },
  { field: 'loanAmount', header: 'ราคา', align: 'right', value: (e: IEvaluatorList): string => formatter.numberFormat2Decimal(e.loanAmount) }
])
</script>

<style scoped></style>
