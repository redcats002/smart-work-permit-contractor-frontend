<template>
  <BaseContainer>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value }">
        <ChipCustomerStatus :value="value" />
      </template>
      <template #[`value.idCard`]="{ value }">
        <CitizenId :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import { useInitDetail } from '@/pages/customer/pages/detail/composables/useInitDetail'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'

interface IProps {
  data: Record<string, unknown>
}

const props = defineProps<IProps>()
const dayjs = useDayjs()

const detail = computed((): ICustomerById => useInitDetail(props.data as Partial<ICustomerById>).value)

const items = computed((): IDisplayList[] => [
  { label: 'สถานะ', key: 'status', value: detail.value.status, hideColon: true },
  { label: 'เลขที่ลูกค้า', key: 'idNo', value: detail.value.idNo },
  { label: 'เลขบัตรประชาชน', key: 'idCard', value: detail.value.idCard },
  { label: 'ชื่อ', key: 'name', value: formatter.fullName(detail.value) },
  { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(detail.value.birthDate) },
  { label: 'อายุ', key: 'age', value: detail.value.birthDate ? dayjs.formatAge(detail.value?.birthDate) : '-' },
  { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: detail.value.customerGroup?.name || '-' },
  { label: 'อาชีพ', key: 'occupation', value: detail.value.occupation?.name || '-' },
  { label: 'เบอร์โทร', key: 'phoneNumber', value: detail.value.phoneNumber },
  { label: 'อีเมล', key: 'email', value: detail.value.email }
])
</script>
