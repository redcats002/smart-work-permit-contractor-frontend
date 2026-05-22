<template>
  <BaseModal
    v-model="visible"
    label="ผู้กู้ทั้งหมด">
    <BaseTable
      v-model:pagination="pagination"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      :columns="columns"
      :items="displayItems"
      disable-auto-left-padding
      disable-virtual-scroll
      hide-pagination>
      <template #[`item.idCard`]="{ value }">
        <CitizenId
          :value="value" />
      </template>
    </BaseTable>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IBorrowersItems } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import CitizenId from '@/components/display/CitizenId.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import { useLocalPagination } from '@/composables/usePagination'

interface IProps {
  borrowers: IBorrowersItems[]
}

const props = defineProps<IProps>()

const visible = defineModel<boolean>('visible', { default: false })

const { formatDate, formatAgeYear } = useDayjs()
const { pagination, sortBy, sortOrder, displayItems, updateItems } = useLocalPagination<IBorrowersItems>()

const columns = ref<IColumn<IBorrowersItems>[]>([
  { field: 'idCard', header: 'เลขบัตรประชาชน', align: 'left', value: (e: IBorrowersItems): string => e.customer?.idCard || '-' },
  { field: 'firstName', header: 'ชื่อลูกค้า', align: 'left', value: (e: IBorrowersItems): string => formatter.fullName({ titleName: (e.customer?.titleName ?? undefined) as TTitleName, firstName: e.customer?.firstName, lastName: e.customer?.lastName }) },
  { field: 'age', header: 'อายุ', align: 'left', value: (e: IBorrowersItems): string => e.customer?.birthDate ? formatAgeYear(e.customer?.birthDate) : '-' },
  { field: 'birthDate', header: 'วันเดือนปีเกิด', sortable: true, align: 'left', value: (e: IBorrowersItems): string => formatDate(e.customer?.birthDate ?? undefined) },
  { field: 'phoneNumber', header: 'เบอร์โทร', align: 'left', value: (e: IBorrowersItems): string => formatter.fullPhoneNumber({ phoneNumber: e.customer?.phoneNumber, phoneNumber2: e.customer?.phoneNumber2 }) },
  { field: 'mainAddress', header: 'ที่อยู่ตามบัตรประชาชน', align: 'left', value: (e: IBorrowersItems): string => e.customer?.mainAddress ? formatter.fullAddress(e.customer?.mainAddress) : '-' }
])

function getRawSortValue (item: IBorrowersItems, field: string): string {
  if (field === 'birthDate') return item.customer?.birthDate ?? ''
  const col = columns.value.find((c: IColumn<IBorrowersItems>): boolean => c.field === field)
  return col?.value ? col.value(item) : ''
}

function applySortAndUpdate (source: IBorrowersItems[]): void {
  const sorted = sortBy.value
    ? [...source].sort((a: IBorrowersItems, b: IBorrowersItems): number => {
      const aVal = getRawSortValue(a, sortBy.value)
      const bVal = getRawSortValue(b, sortBy.value)
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder.value === 'asc' ? cmp : -cmp
    })
    : [...source]
  updateItems(sorted)
}

watch((): IBorrowersItems[] => props.borrowers, (newBorrowers: IBorrowersItems[]): void => {
  pagination.value.limit = newBorrowers.length || 9999
  applySortAndUpdate(newBorrowers)
}, { immediate: true })

watch([sortBy, sortOrder], (): void => {
  applySortAndUpdate(props.borrowers)
})
</script>
