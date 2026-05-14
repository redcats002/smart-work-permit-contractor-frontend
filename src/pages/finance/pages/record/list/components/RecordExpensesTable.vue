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
      <LinkText :to="{ name: 'ExpenseDetailPage', params: { id: item.id } }">
        {{ item.idNo }}
      </LinkText>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="flex justify-end">
        <BaseActionMenu :items="getActionItems(item)" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import { toast } from '@/plugins/toast'
import type { IExpensesList } from '@/models/response/expenses/ExpensesRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/expenses.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IExpensesList[]
}
const props = defineProps<IProps>()

interface IEmits {
  update: []
}
const emits = defineEmits<IEmits>()

const router = useRouter()
const expensesService: IExpensesProvider = new ExpensesProvider()

const pagination = defineModel<IPagination>('pagination', { required: true })
const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const { formatDate } = useDayjs()

const columns = ref<IColumn<IExpensesList>[]>([
  { field: 'idNo', header: 'เลขที่', sortable: true, align: 'left' },
  { field: 'createdAt', header: 'วันที่', align: 'left', value: (e: IExpensesList): string => formatDate(e.createdAt) },
  { field: 'type', header: 'รับ/จ่าย', align: 'left', value: (e: IExpensesList): string => formatTitle(e.type) },
  { field: 'expenseType', header: 'ประเภท', align: 'left' },
  { field: 'expenseCategory', header: 'หมวดหมู่ค่าใช้จ่าย', align: 'left' },
  { field: 'amount', header: 'มูลค่า (บาท)', sortable: true, align: 'right', value: (e: IExpensesList): string => formatter.numberFormat(e.amount) },
  { field: 'actions', header: '', align: 'right' }
])

function getActionItems (item: IExpensesList): IMenuItemAction[] {
  return [
    {
      label: 'แก้ไข',
      key: 'edit',
      type: 'TEXT',
      action: (): void => {
        router.push({ name: 'ExpenseEditPage', params: { id: item.id } })
      }
    },
    {
      label: 'ลบ',
      key: 'delete',
      type: 'DELETE',
      action: (): void => {
        handleLoading(async (): Promise<void> => {
          await expensesService.deleteExpenses(item.id)
          toast.success('ดำเนินการสำเร็จ')
          emits('update')
        })
      }
    }
  ]
}
</script>
