<template>
  <DisplayList :items="items">
    <template #[`value.totalValue`]="{ value }">
      {{ `${value} บาท` || '-' }}
    </template>
  </DisplayList>
  <div
    v-if="data.files.length"
    class="flex gap-2 mt-5">
    <template
      v-for="(file, _i) in data.files"
      :key="_i">
      <a
        :href="file.fileUrl"
        class="border border-[#BDBDBD] rounded-lg p-3 flex flex-col items-center justify-center"
        target="_blank">
        <Icon
          icon="material-icon-theme:pdf"
          style="font-size: 90px;" />
        <div class="text-sm">
          {{ file.originalName }}
        </div>
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
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
    { label: 'เลขที่', key: 'expenseNo', value: props.data.expenseNo },
    { label: 'วันที่', key: 'date', value: dayjs.formatDate(props.data.date) },
    { label: 'ผู้ทำรายการ', key: 'createdBy', value: `${props.data.createdBy?.firstName} ${props.data.createdBy?.lastName}` },
    { label: 'รับ/จ่าย', key: 'expensesType', value: formatTitle(props.data.expensesType) },
    { label: 'ประเภทค่าใช้จ่าย', key: 'type', value: props.data.type },
    { label: 'หมวดหมู่ค่าใช้จ่าย', key: 'category', value: props.data.category },
    { label: 'หมายเหตุ', key: 'note', value: props.data.note || '-' },
    { label: 'จำนวนเงิน', key: 'totalValue', value: props.data.totalValue || '-' }
  ]
})
</script>

<style scoped>

</style>
