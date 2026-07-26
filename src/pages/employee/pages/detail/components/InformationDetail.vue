<template>
  <BaseContainer>
    <template #topright>
      <EmployeeDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')"
        @reset-password="emits('resetPassword')" />
    </template>
    <div class="flex items-start gap-4">
      <BaseImage
        :file-path="data?.image"
        class="object-contain"
        width="152" />
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
import { formatter } from '@/utils/Formatter'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import { formatTitle } from '@/enums/modules/employee/EmployeeRole.enum'
import { formatTitle as formatManagementPositionTitle } from '@/enums/modules/management-structure/ManagementPosition.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BaseImage from '@/components/base/BaseImage.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipEmployeeStatus from '../../list/components/ChipEmployeeStatus.vue'
import EmployeeDetailMenuAction from './EmployeeDetailMenuAction.vue'

interface IProps {
  data: IEmployeeById
}
interface IEmits {
  resetPassword: []
  edit: []
  delete: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  const isSupervisor = props.data.role === 'SUPERVISOR'
  const isLineSupervisor = props.data.managementPosition?.managementPosition === 'LINE_MANAGER'
  const supervisorLineItems: IDisplayList[] = [
    { label: 'ตำแหน่งผังบริการ', key: 'managementPosition.managementPosition', value: formatManagementPositionTitle(props.data.managementPosition?.managementPosition) || '-' },
    { label: isLineSupervisor ? 'หัวหน้าสาย' : 'ผู้จัดการเขต', key: 'managementPosition.name', value: props.data.managementPosition?.name || '-' }
  ]

  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'รหัสพนักงาน', key: 'id', value: props.data?.idNo },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data?.idCard },
    { label: 'ชื่อ', key: 'name', value: formatter.fullName(props.data) },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(props.data.dateOfBirth) },
    { label: 'อายุ', key: 'age', value: dayjs.formatAge(props.data.dateOfBirth) },
    { label: 'อีเมล', key: 'email', value: props.data.email },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'ตำแหน่ง', key: 'role', value: formatTitle(props.data.role) },
    ...isSupervisor ? supervisorLineItems : [],
    { label: 'สาขา', key: 'branches', value: props.data.branches?.map((e: IBranchList): string => e?.name || '-').join(', ') }
  ]
})


</script>

<style scoped>

</style>
