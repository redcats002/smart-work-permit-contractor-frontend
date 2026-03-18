<template>
  <BaseTable
    v-model:pagination="pagination"
    v-model:sort-by="sortBy"
    v-model:sort-order="sortOrder"
    :columns="columns"
    :items="props.items"
    disable-auto-left-padding
    @update="emits('update')" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractGuarantorList } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import type { IPagination } from '@/composables/usePagination'

interface IProps {
  items: IContractGuarantorList[]
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

const columns = ref<IColumn<IContractGuarantorList>[]>([
  { field: 'idCard', header: 'เลขบัตรประชาชน', value: (e: IContractGuarantorList): string => dayjs.formatDate(e?.createdAt || '') },
  { field: 'firstName', header: 'ชื่อ', value: (e: IContractGuarantorList): string => formatter.fullName(e) || '-' },
  { field: 'birthDate', header: 'วันเดือนปีเกิด', value: (e: IContractGuarantorList): string => dayjs.formatDate(e?.birthDate || '') },
  { field: 'age', header: 'อายุ', value: (e: IContractGuarantorList): string => dayjs.formatAge(e?.birthDate || '') },
  { field: 'phoneNumber', header: 'เบอร์โทร', value: (e: IContractGuarantorList): string => formatter.fullPhoneNumber(e) },
  { field: 'address', header: 'ที่อยู่ตามบัตรประจำตัวประชาชน', value: (e: IContractGuarantorList): string => formatter.fullAddress(e.mainAddress) }
])
</script>

<style scoped></style>
