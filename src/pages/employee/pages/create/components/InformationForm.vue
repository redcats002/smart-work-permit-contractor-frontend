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
        required />
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
      <!-- <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          label="คำนำหน้า"
          name="title"
          hide-error>
          <TitleNameSelection
            v-model="model.title"
            :invalid="invalid"
            name="title"
            dropdown />
        </LabelField>
        <LabelField
          v-model="model.firstName"
          :form="form"
          label="ชื่อ"
          name="firstName"
          hide-error
          required />
      </div> -->
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
          placeholder="เลือกตำแหน่ง" />
      </LabelField>
      <LabelField
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
import type { IFormState } from '@/models/Form.model'
import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import { EmployeeStatusEnum } from '@/enums/modules/employee/EmployeeStatus.enum'
import { TitleNameItems } from '@/enums/TitleName.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PhoneNumberInput from '@/components/input/PhoneNumberInput.vue'
import Switch from '@/components/input/Switch.vue'
import BranchSelection from '@/components/selection/modules/api/branch/BranchSelection.vue'
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
  default: useFormInitialValues()
})

const isActive = computed({
  get (): boolean {
    return model.value.status === 'ACTIVE'
  },
  set (value: boolean): void {
    model.value.status = value ? EmployeeStatusEnum.ACTIVE : EmployeeStatusEnum.INACTIVE
  }
})
</script>

<style scoped>

</style>
