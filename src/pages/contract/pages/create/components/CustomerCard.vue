<template>
  <div
    v-if="data"
    :class="['border border-surface-200 rounded-md p-4', { 'border-none! p-0!': hideBorder }]">
    <DisplayList :items="items">
      <template #[`value.status`]>
        <ChipCustomerStatus :value="data.status" />
      </template>
      <template #[`value.idCard`]="{ value }">
        <CitizenId
          :value="value" />
      </template>
    </DisplayList>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import { formatTitle } from '@/enums/modules/customer/PersonalType.enum'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'

interface IProps {
  data?: ICustomerById
  hideBorder?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  data: undefined,
  hideBorder: false
})

const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  const individual: IDisplayList[] = [
    { label: 'สถานะ', key: 'status', value: props.data?.status, hideColon: true, hidden: !props.data?.status },
    { label: 'เลขที่ลูกค้า', key: 'idNo', value: props.data?.idNo },
    { label: 'ประเภทบุคคล', key: 'personalType', value: formatTitle(props.data?.personalType) },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data?.idCard },
    { label: 'ชื่อ', key: 'name', value: props.data ? formatter.fullName(props.data) : '-' },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: props.data?.birthDate ? dayjs.formatDate(props.data?.birthDate) : '-' },
    { label: 'อายุ', key: 'age', value: props.data?.birthDate ? dayjs.formatAge(props.data?.birthDate) : '-' },
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: props.data?.customerGroup?.name || '-' },
    { label: 'อาชีพ', key: 'occupation', value: props.data?.occupation?.name || '-' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data ? formatter.fullPhoneNumber(props.data) : '-' },
    { label: 'อีเมล', key: 'email', value: props.data?.email || '-' }
  ]
  const corporate: IDisplayList[] = [
    { label: 'สถานะ', key: 'status', value: props.data?.status, hideColon: true, hidden: !props.data?.status },
    { label: 'เลขที่ลูกค้า', key: 'idNo', value: props.data?.idNo },
    { label: 'ประเภทบุคคล', key: 'personalType', value: formatTitle(props.data?.personalType) },
    { label: 'เลขประจำตัวผู้เสียภาษี', key: 'idCard', value: props.data?.idCard },
    { label: 'ชื่อ', key: 'name', value: formatter.fullName(props.data) || '-' },
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: props.data?.customerGroup?.name || '-' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data ? formatter.fullPhoneNumber(props.data) : '-' },
    { label: 'อีเมล', key: 'email', value: props.data?.email || '-' }
  ]
  if (props.data?.personalType === 'INDIVIDUAL') return individual
  return corporate
})
</script>
