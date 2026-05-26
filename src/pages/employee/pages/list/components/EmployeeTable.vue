<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="items"
    disable-auto-left-padding
    @update="emits('update')">
    <template #[`item.idNo`]="{ item }">
      <LinkText
        :target="linkBlank ? '_blank' : '_self'"
        :to="{ name: 'EmployeeDetailPage', params: { id: item.id } }">
        {{ item?.idNo }}
      </LinkText>
    </template>
    <template #[`item.status`]="{ item }">
      <div class="flex justify-end">
        <ChipEmployeeStatus :value="item.status" />
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipEmployeeStatus from './ChipEmployeeStatus.vue'

interface IProps {
  hideColumns?: (keyof IEmployeeList)[]
  linkBlank?: boolean
  items: IEmployeeList[]
}

const props = withDefaults(defineProps<IProps>(), {
  hideColumns: undefined,
  linkBlank: false
})

interface IEmits {
  delete: [id: number]
  update: []
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>('pagination', {
  required: true
})

const sortBy = defineModel<string>('sortBy', { default: '' })
const sortOrder = defineModel<'asc' | 'desc'>('sortOrder', { default: 'desc' })

const columns = computed((): IColumn<IEmployeeList>[] => {
  const base: IColumn<IEmployeeList>[] = [
    { field: 'idNo', header: 'เลขที่พนักงาน', sortable: true, align: 'left', style: { width: '130px', minWidth: '130px' } },
    { field: 'firstName', header: 'ชื่อพนักงาน', align: 'left', style: { width: '180px', minWidth: '180px' }, bodyStyle: { whiteSpace: 'normal', wordBreak: 'break-word' }, value: (e: IEmployeeList): string => formatter.fullName(e) },
    { field: 'status', header: 'สถานะ', sortable: true, align: 'right', style: { width: '120px', minWidth: '120px' } }
  ]
  return base.filter((c: IColumn<IEmployeeList>): boolean => !props.hideColumns?.includes(c.field as keyof IEmployeeList))
})
</script>

<style scoped></style>
