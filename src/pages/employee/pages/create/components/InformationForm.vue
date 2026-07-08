<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="col-span-1 md:col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน" />
      <LabelField
        v-model="model.idCard"
        :form="form"
        label="เลขบัตรประชาชน"
        name="idCard"
        hide-error
        required
        @keypress="keypress.thaiCitizenId"
        @paste="handlePasteIdCard($event)" />
      <LabelField
        v-model="model.firstName"
        v-model:prepend-option="model.title"
        :form="form"
        :prepend-options="TitleNameItems"
        label="ชื่อ"
        name="firstName"
        name-prepend-option="title"
        hide-error
        required />
      <LabelField
        v-model="model.lastName"
        :form="form"
        label="นามสกุล"
        name="lastName"
        hide-error
        required />
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="วันเดือนปีเกิด"
        name="dateOfBirth"
        hide-error
        required>
        <DatePickerInput
          v-model="model.dateOfBirth"
          :invalid="invalid"
          :max-date="dayjs().toDate()"
          name="dateOfBirth" />
      </LabelField>
      <LabelField
        v-model="model.email"
        :form="form"
        label="อีเมล"
        name="email"
        hide-error
        required
        @keypress="keypress.emailNoThai($event)" />
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="เบอร์โทร"
        name="phoneNumber"
        hide-error
        required>
        <PhoneNumberInput
          v-model="model.phoneNumber"
          :invalid="invalid"
          name="phoneNumber" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ตำแหน่ง"
        name="role"
        tag="div"
        hide-error
        required>
        <RoleSelection
          v-model="model.role"
          :invalid="invalid"
          name="role"
          placeholder="เลือกตำแหน่ง"
          @update:model-value="onRoleChange()" />
      </LabelField>
      <LabelField
        v-if="isSupervisor"
        v-slot="{ invalid }"
        :form="form"
        label="ตำแหน่งผังบริการ"
        name="managementPositionType"
        tag="div"
        hide-error
        required>
        <ManagementPositionTypeSelection
          v-model="model.managementPositionType"
          :form="form"
          :invalid="invalid"
          name="managementPositionType"
          placeholder="เลือกตำแหน่งผังบริหาร"
          @update:model-value="onPositionTypeChange()" />
      </LabelField>
      <LabelField
        v-if="isSupervisor && model.managementPositionType"
        v-slot="{ invalid }"
        :form="form"
        :label="managementPositionLabel"
        name="managementPositionId"
        tag="div"
        hide-error
        required>
        <ManagementPositionByTypeSelection
          v-model="model.managementPositionId"
          :form="form"
          :invalid="invalid"
          :management-position="model.managementPositionType || undefined"
          :placeholder="managementPositionLabel"
          name="managementPositionId" />
      </LabelField>
      <LabelField
        v-if="isStaff"
        v-slot="{ invalid }"
        :form="form"
        label="สาขา"
        name="branchIds"
        hide-error
        required>
        <BranchSelection
          v-model="model.branchIds"
          :invalid="invalid"
          name="branchIds"
          placeholder="เลือกสาขา"
          multiple
          @update:model-value="emits('mount')" />
      </LabelField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import keypress from '@/utils/Keypress'
import paste from '@/utils/Paste'
import type { IFormState } from '@/models/Form.model'
import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import { EmployeeRoleEnum } from '@/enums/modules/employee/EmployeeRole.enum'
import { EmployeeStatusEnum } from '@/enums/modules/employee/EmployeeStatus.enum'
import { EManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import { TitleNameItems } from '@/enums/TitleName.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PhoneNumberInput from '@/components/input/PhoneNumberInput.vue'
import Switch from '@/components/input/Switch.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'
import ManagementPositionByTypeSelection from '@/components/selection/modules/api/management-position-by-type/ManagementPositionByTypeSelection.vue'
import ManagementPositionTypeSelection from '@/components/selection/modules/static/management-position-type/ManagementPositionTypeSelection.vue'
import RoleSelection from '@/components/selection/modules/static/role/RoleSelection.vue'
import { useFormInitialValues } from '../schema/employee.schema'

interface IProps {
  form?: IFormState
}
interface IEmits {
  mount: []
}
const emits = defineEmits<IEmits>()
defineProps<IProps>()

const dayjs = useDayjs()

const model = defineModel<ICreateEmployeePayload>({
  default: (): ICreateEmployeePayload => useFormInitialValues()
})

const isActive = computed({
  get (): boolean {
    return model.value.status === 'ACTIVE'
  },
  set (value: boolean): void {
    model.value.status = value ? EmployeeStatusEnum.ACTIVE : EmployeeStatusEnum.INACTIVE
  }
})

const isSupervisor = computed((): boolean => model.value.role === EmployeeRoleEnum.SUPERVISOR)
const isStaff = computed((): boolean => model.value.role === EmployeeRoleEnum.STAFF)

const managementPositionLabel = computed((): string => {
  if (model.value.managementPositionType === EManagementPosition.DISTRICT_MANAGER) return 'ผู้จัดการเขต'
  if (model.value.managementPositionType === EManagementPosition.LINE_MANAGER) return 'หัวหน้าสาย'
  return 'ตำแหน่งผังบริการ'
})

function onRoleChange (): void {
  model.value.managementPositionType = undefined
  model.value.managementPositionId = null
  emits('mount')
}

function onPositionTypeChange (): void {
  model.value.managementPositionId = null
  emits('mount')
}

function handlePasteNumber (evt: ClipboardEvent, key: keyof ICreateEmployeePayload): void {
  (model.value as Record<string, unknown>)[key] = ''
  ;(model.value as Record<string, unknown>)[key] = paste.citizenId(evt)
  emits('mount')
}

function handlePasteIdCard (evt: ClipboardEvent): void {
  handlePasteNumber(evt, 'idCard')
}
</script>

<style scoped>

</style>
