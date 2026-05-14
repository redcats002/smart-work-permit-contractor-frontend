<template>
  <DisplayList :items="items">
    <template #[`value.amount`]="{ value }">
      {{ `${formatter.numberFormat(value)} บาท` || '-' }}
    </template>
  </DisplayList>
  <div
    v-if="data.files.length"
    class="flex gap-2 mt-5">
    <template
      v-for="(file, _i) in data.files"
      :key="_i">
      <a
        :href="file.url"
        class="border border-[#BDBDBD] rounded-lg p-3 flex flex-col items-center justify-center"
        target="_blank">
        <Icon
          icon="material-icon-theme:pdf"
          style="font-size: 90px;" />
        <div class="text-sm">
          {{ file.name }}
        </div>
      </a>
    </template>
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
import { Icon } from '@iconify/vue'

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
