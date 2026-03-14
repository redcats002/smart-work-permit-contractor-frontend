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
    <template #[`item.contractIdNo`]="{ item }">
      <LinkText :to="{}">
        {{ item?.contractIdNo }}
      </LinkText>
    </template>
    <template #[`item.estateStatus`]="{ item }">
      <ChipEstateStatus :value="item?.estateStatus" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerEstateList } from '@/models/response/customer/CustomerRes.model'
import type { IColumn } from '@/models/Table.model'
import LinkText from '@/components/button/LinkText.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'
import ChipEstateStatus from './ChipContactHistoryStatus.vue'

interface IProps {
  items: ICustomerEstateList[]
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

const columns = ref<IColumn<ICustomerEstateList>[]>([
  { field: 'createdAt', header: 'วันที่', align: 'left', value: (e: ICustomerEstateList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'idNo', header: 'เลขที่ลูกค้า', align: 'left' },
  { field: 'contractIdNo', header: 'เลขที่สัญญา', align: 'left' },
  { field: 'estateType', header: 'ประเภท', align: 'left', value: (e: ICustomerEstateList): string => e?.estateType?.name || '-' },
  { field: 'storage', header: 'จุดจัดเก็บเอกสาร', align: 'left' },
  { field: 'estateStatus', header: 'สถานะอสังหา', align: 'left' }
])
</script>

<style scoped></style>
