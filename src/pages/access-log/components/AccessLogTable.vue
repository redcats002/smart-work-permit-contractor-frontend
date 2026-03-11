<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.employee.idNo`]="{ item }">
      <LinkText :to="{}">
        {{ item.idNo }}
      </LinkText>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IAccessLogList } from '@/models/response/access-log/AccessLogRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IAccessLogList[]
}

const props = defineProps<IProps>()

interface IEmits {
  delete: [id: number]
  edit: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = ref<IColumn<IAccessLogList>[]>([
  { header: 'ลำดับ', field: 'index' },
  { header: 'วันที่', field: 'date' },
  { header: 'เวลา', field: 'time' },
  { header: 'เลขที่พนักงาน', field: 'employee.idNo' },
  { header: 'ชื่อพนักงาน', field: 'employee.firstName' },
  { header: 'ชื่อเมนูที่ใช้งาน', field: 'menuName' },
  { header: 'การเข้าถึง', field: 'accessType' },
  { header: 'เลขที่เอกสาร', field: 'document.idNo' },
  { header: 'สาขา', field: 'branch.name' }
])
</script>

<style scoped></style>
