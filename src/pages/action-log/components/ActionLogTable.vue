<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.index`]="{ index }">
      {{ getTableIndex(index, pagination) }}
    </template>
    <template #[`item.userNo`]="{ item }">
      <LinkText :to="{}">
        {{ item?.userNo || '-' }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { getTableIndex } from '@/utils/Table'
import type { IActionLogList } from '@/models/response/action-log/ActionLogRes.model'
import type { IColumn } from '@/models/Table.model'
import { formatTitle } from '@/enums/modules/action-log/ActionLogType.enum'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IActionLogList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  edit: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const { formatDate, formatTime } = useDayjs()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IActionLogList>[]>([
  { header: 'ลำดับ', field: 'index' },
  { header: 'วันที่', field: 'createdAtDate', sortable: true, value: (item: IActionLogList): string => formatDate(item.createdAtDate) },
  { header: 'เวลา', field: 'createdAtTime', sortable: true, value: (item: IActionLogList): string => formatTime(item.createdAtTime) },
  { header: 'เลขที่พนักงาน', field: 'userNo', sortable: true },
  { header: 'ชื่อพนักงาน', field: 'userName', value: (item: IActionLogList): string => item?.userName || '-' },
  { header: 'ชื่อเมนูที่ใช้งาน', field: 'frontendMenuName' },
  { header: 'การเข้าถึง', field: 'action', value: (item: IActionLogList): string => formatTitle(item.action) },
  { header: 'เลขที่เอกสาร', field: 'ref' },
  { header: 'สาขา', field: 'branch' }
])
</script>

<style scoped></style>
