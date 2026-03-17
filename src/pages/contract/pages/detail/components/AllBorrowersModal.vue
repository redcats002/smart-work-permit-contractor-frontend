<template>
  <BaseModal
    v-model="visible"
    label="ผู้กู้ทั้งหมด">
    <BaseTable
      :columns="columns"
      :items="customers"
      :show-footer="false"
      disable-auto-left-padding />
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IBorrowersItems } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import BaseModal from '@/components/modal/BaseModal.vue'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  borrowers: IBorrowersItems[]
}

const { borrowers: customers } = defineProps<IProps>()

const visible = defineModel<boolean>('visible', { default: false })

const { formatDate, formatAgeYear } = useDayjs()

const columns = ref<IColumn<IBorrowersItems>[]>([
  {
    field: 'idCard',
    header: 'เลขบัตรประชาชน',
    align: 'left',
    value: (e: IBorrowersItems): string => e.customer?.idCard ? formatter.thaiCitizenId(e.customer?.idCard) : '-'
  },
  {
    field: 'firstName',
    header: 'ชื่อลูกค้า',
    sortable: true,
    align: 'left',
    value: (e: IBorrowersItems): string => formatter.fullName({
      titleName: (e.customer?.titleName ?? undefined) as TTitleName,
      firstName: e.customer?.firstName,
      lastName: e.customer?.lastName
    })
  },
  {
    field: 'age',
    header: 'อายุ',
    align: 'left',
    value: (e: IBorrowersItems): string => e.customer?.birthDate ? formatAgeYear(e.customer?.birthDate) : '-'
  },
  {
    field: 'birthDate',
    header: 'วันเดือนปีเกิด',
    align: 'left',
    value: (e: IBorrowersItems): string => formatDate(e.customer?.birthDate ?? undefined)
  },
  {
    field: 'phoneNumber',
    header: 'เบอร์โทร',
    align: 'left',
    value: (e: IBorrowersItems): string => formatter.fullPhoneNumber({ phoneNumber: e.customer?.phoneNumber, phoneNumber2: e.customer?.phoneNumber2 })
  },
  {
    field: 'mainAddress',
    header: 'ที่อยู่ตามบัตรประชาชน',
    align: 'left',
    value: (e: IBorrowersItems): string => e.customer?.mainAddress ? formatter.fullAddress(e.customer?.mainAddress) : '-'
  }
])
</script>
