<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText :to="{}">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.contractStatus`]="{ item }">
      <ChipContractStatus :value="item?.status" />
      <Icon
        v-if="item?.isLate"
        color="#F2994A"
        icon="fluent:clock-warning-24-regular" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerContractList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'
import ChipContractStatus from './ChipContractStatus.vue'

interface IProps {
  items: ICustomerContractList[]
}

const props = defineProps<IProps>()

interface IEmits {
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerContractList>[]>([
  { field: 'idNo', header: 'เลขที่สัญญา', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
  { field: 'contractedAt', header: 'วันที่ทำสัญญา', sortable: true, align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: ICustomerContractList): string => dayjs.formatDate(e?.contractedAt || '') },
  { field: 'contractType', header: 'ประเภทเงินกู้', align: 'left', style: { width: '160px', minWidth: '160px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: ICustomerContractList): string => e?.contractLoanType?.name || '-' },
  { field: 'loanLimit', header: 'วงเงินกู้ (บาท)', align: 'right', style: { width: '140px', minWidth: '140px' }, value: (e: ICustomerContractList): string => formatter.numberFormat2Decimal(e?.loanAmount) || '-' },
  { field: 'contractStartAt', header: 'วันที่เริ่ม', sortable: true, align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: ICustomerContractList): string => dayjs.formatDate(e?.firstInstallmentDate || '') },
  { field: 'contractEndAt', header: 'วันที่สิ้นสุด', sortable: true, align: 'left', style: { width: '120px', minWidth: '120px' }, value: (e: ICustomerContractList): string => dayjs.formatDate(e?.finalInstallmentDate || '') },
  { field: 'contractStatus', header: 'สถานะ', sortable: true, align: 'left', style: { width: '120px', minWidth: '120px' } }
])
</script>

<style scoped></style>
