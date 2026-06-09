<template>
  <BaseContainer>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value }">
        <ChipEmployeeStatus :value="value" />
      </template>
      <template #[`value.idCard`]="{ value }">
        <CitizenId :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import { useInitDetail } from '@/pages/employee/pages/detail/composables/useInitDetail'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { formatTitle } from '@/enums/modules/employee/EmployeeRole.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipEmployeeStatus from '@/pages/employee/pages/list/components/ChipEmployeeStatus.vue'

interface IProps {
  data: Record<string, unknown>
}

const props = defineProps<IProps>()
const dayjs = useDayjs()

const detail = computed((): IEmployeeById => useInitDetail(props.data as Partial<IEmployeeById>).value)

const items = computed((): IDisplayList[] => [
  { label: 'สถานะ', key: 'status', value: detail.value.status, hideColon: true },
  { label: 'เลขที่พนักงาน', key: 'idNo', value: detail.value.idNo },
  { label: 'เลขบัตรประชาชน', key: 'idCard', value: detail.value.idCard },
  { label: 'ชื่อ', key: 'name', value: formatter.fullName(detail.value) },
  { label: 'วันเดือนปีเกิด', key: 'dateOfBirth', value: dayjs.formatDate(detail.value.dateOfBirth) },
  { label: 'อายุ', key: 'age', value: dayjs.formatAge(detail.value.dateOfBirth) },
  { label: 'อีเมล', key: 'email', value: detail.value.email },
  { label: 'เบอร์โทร', key: 'phoneNumber', value: detail.value.phoneNumber },
  { label: 'ตำแหน่ง', key: 'role', value: formatTitle(detail.value.role) },
  { label: 'สาขา', key: 'branches', value: detail.value.branches?.map((e: IBranchList): string => e?.name || '-').join(', ') }
])
</script>
