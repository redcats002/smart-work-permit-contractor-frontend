<template>
  <div
    v-if="data"
    class="border border-surface-200 rounded-md p-4">
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
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'

interface IProps {
  data?: ICustomerById
}

const props = withDefaults(defineProps<IProps>(), {
  data: undefined
})

const { formatDate, formatAge } = useDayjs()

const items = computed((): IDisplayList[] => {
  const d = props.data
  if (!d) return []
  return [
    { key: 'status', label: 'สถานะ', value: d.status },
    { key: 'idNo', label: 'เลขที่ลูกค้า', value: d.idNo || '-' },
    { key: 'idCard', label: 'เลขบัตรประชาชน', value: d.idCard },
    { key: 'birthDate', label: 'วันเกิด', value: formatDate(d.birthDate ?? undefined) },
    { key: 'age', label: 'อายุ', value: formatAge(d.birthDate ?? undefined) },
    { key: 'customerGroup', label: 'กลุ่มลูกค้า', value: d.customerGroup?.name || '-' },
    { key: 'occupation', label: 'อาชีพ', value: d.occupation?.name || '-' },
    { key: 'phoneNumber', label: 'เบอร์โทร', value: formatter.fullPhoneNumber({ phoneNumber: d.phoneNumber, phoneNumber2: d.phoneNumber2 }) },
    { key: 'email', label: 'อีเมล', value: d.email || '-' }
  ]
})
</script>
