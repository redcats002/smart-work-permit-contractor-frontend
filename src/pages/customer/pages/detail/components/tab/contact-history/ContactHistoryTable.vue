<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.contractIdNo`]="{ item }">
      <LinkText :to="{}">
        {{ item?.contract?.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerContactHistoryList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: ICustomerContactHistoryList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<ICustomerContactHistoryList>[]>([
  { field: 'contactAt', header: 'วันที่', align: 'left', value: (e: ICustomerContactHistoryList): string => dayjs.formatDate(e?.contactAt || '') },
  { field: 'contractIdNo', header: 'เลขที่สัญญาที่เกี่ยวข้อง', sortable: true, align: 'left' },
  { field: 'subject', header: 'หัวข้อ', align: 'left', value: (e: ICustomerContactHistoryList): string => e?.topic || '' },
  { field: 'detail', header: 'รายละเอียด', align: 'left', value: (e: ICustomerContactHistoryList): string => e?.note || '' },
  { field: 'createdBy', header: 'โดยพนักงาน', align: 'left', value: (e: ICustomerContactHistoryList): string => formatter.fullName(e?.employee || {}) || '-' }
])
</script>

<style scoped></style>
