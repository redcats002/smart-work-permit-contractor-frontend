<template>
  <DisplayList :items="items">
    <template #[`value.amount`]="{ value }">
      {{ `${formatter.numberFormat(value)} บาท` || '-' }}
    </template>
  </DisplayList>
  <div class="mt-4">
    <FileAttachment
      v-if="data?.files?.length"
      :files="data.files" />
    <Empty
      v-else
      title="ไม่มีไฟล์แนบ" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IExpensesById } from '@/models/response/expenses/ExpensesRes.model'
import { formatTitle } from '@/enums/modules/finance/ExpenseType.enum'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import Empty from '@/components/display/Empty.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'

interface IProps {
  data: IExpensesById
}
const props = defineProps<IProps>()
const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'เลขที่', key: 'idNo', value: props.data.idNo },
    { label: 'วันที่', key: 'expenseDate', value: dayjs.formatDate(props.data.expenseDate) },
    { label: 'ผู้ทำรายการ', key: 'createdBy', value: props.data.createdBy },
    { label: 'รับ/จ่าย', key: 'type', value: formatTitle(props.data.type) },
    { label: 'ประเภทค่าใช้จ่าย', key: 'expenseType', value: props.data.expenseType },
    { label: 'หมวดหมู่ค่าใช้จ่าย', key: 'expenseCategory', value: props.data.expenseCategory },
    { label: 'หมายเหตุ', key: 'reason', value: props.data.reason || '-' },
    { label: 'จำนวนเงิน', key: 'amount', value: props.data.amount }
  ]
})
</script>
