<template>
  <BaseContainer>
    <template #topright>
      <EmployeeDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')" />
    </template>
    <div class="flex items-start gap-4">
      <img
        class="object-contain"
        src="/assets/images/logo.png"
        width="152">
      <DisplayList :items="items">
        <template #[`value.status`]="{ value}">
          <ChipEmployeeStatus :value="value" />
        </template>
        <template #[`value.idCard`]="{ value }">
          <CitizenId
            :value="value" />
        </template>
      </DisplayList>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import { formatTitle } from '@/enums/modules/employee/EmployeeRole.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipEmployeeStatus from '../../list/components/ChipEmployeeStatus.vue'
import EmployeeDetailMenuAction from './EmployeeDetailMenuAction.vue'
import { formatter } from '@/utils/Formatter'

interface IProps {
  data: IEmployeeById
}
interface IEmits {
  edit: []
  delete: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'id', value: props.data?.idNo },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data?.idCard },
    { label: 'ชื่อ', key: 'name', value: formatter.fullName(props.data) },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(props.data.dateOfBirth) },
    { label: 'อายุ', key: 'age', value: dayjs.formatAge(props.data.dateOfBirth) },
    { label: 'อีเมล', key: 'email', value: props.data.email },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'ตำแหน่ง', key: 'role', value: formatTitle(props.data.role) },
    { label: 'สาขา', key: 'branches', value: props.data.branches?.map((e: IBranchList): string => e?.name || '-').join(', ') }
  ]
})


</script>

<style scoped>

</style>
