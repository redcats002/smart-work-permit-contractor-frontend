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
import type { IContractCustomer } from '@/models/response/contract/ContractRes.model'
import type { IColumn } from '@/models/Table.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import BaseModal from '@/components/modal/BaseModal.vue'
import BaseTable from '@/components/table/BaseTable.vue'

interface IProps {
  customers: IContractCustomer[]
}

const { customers } = defineProps<IProps>()

const visible = defineModel<boolean>('visible', { default: false })

const { formatDate, formatAgeYear } = useDayjs()

const columns = ref<IColumn<IContractCustomer>[]>([
  {
    field: 'idCard',
    header: 'เลขบัตรประชาชน',
    align: 'left',
    value: (e: IContractCustomer): string => e.idCard ? formatter.thaiCitizenId(e.idCard) : '-'
  },
  {
    field: 'firstName',
    header: 'ชื่อลูกค้า',
    sortable: true,
    align: 'left',
    value: (e: IContractCustomer): string => formatter.fullName({
      titleName: (e.titleName ?? undefined) as TTitleName,
      firstName: e.firstName,
      lastName: e.lastName
    })
  },
  {
    field: 'age',
    header: 'อายุ',
    align: 'left',
    value: (e: IContractCustomer): string => e.birthDate ? formatAgeYear(e.birthDate) : '-'
  },
  {
    field: 'birthDate',
    header: 'วันเดือนปีเกิด',
    align: 'left',
    value: (e: IContractCustomer): string => formatDate(e.birthDate ?? undefined)
  },
  {
    field: 'phoneNumber',
    header: 'เบอร์โทร',
    align: 'left',
    value: (e: IContractCustomer): string => formatter.fullPhoneNumber({ phoneNumber: e.phoneNumber, phoneNumber2: e.phoneNumber2 })
  },
  {
    field: 'mainAddress',
    header: 'ที่อยู่ตามบัตรประชาชน',
    align: 'left',
    value: (e: IContractCustomer): string => e.mainAddress ? formatter.fullAddress(e.mainAddress) : '-'
  }
])
</script>
