<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน" />
      <LabelField
        v-model="model.citizenId"
        :form="form"
        label="เลขบัตรประชาชน"
        name="citizenId"
        required />
      <div class="w-full grid grid-cols-2 gap-5">
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          label="คำนำหน้า"
          name="titleName">
          <TitleNameSelection
            v-model="model.titleName"
            :invalid="invalid"
            dropdown />
        </LabelField>
        <LabelField
          v-model="model.firstName"
          :form="form"
          label="ชื่อ"
          name="firstName"
          required />
      </div>
      <LabelField
        v-model="model.lastName"
        :form="form"
        label="นามสกุล"
        name="lastName"
        required />
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="วันเดือนปีเกิด"
        name="birthDate"
        required>
        <DatePickerInput
          v-model="model.birthDate"
          :invalid="invalid" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="กลุ่มลูกค้า"
        name="customerGroupId">
        <CustomerGroupSelection
          v-model="model.customerGroupId"
          :invalid="invalid" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="อาชีพ"
        name="jobId">
        <CustomerOccupationSelection
          v-model="model.jobId"
          :invalid="invalid" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="เบอร์โทร"
        name="phoneNumber"
        required>
        <PhoneNumberInput
          v-model="model.phoneNumber"
          :invalid="invalid"
          name="phoneNumber" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="เบอร์โทร 2"
        name="phoneNumber2">
        <PhoneNumberInput
          v-model="model.phoneNumber2"
          :invalid="invalid"
          name="phoneNumber2" />
      </LabelField>
      <LabelField
        v-model="model.email"
        :form="form"
        label="อีเมล"
        name="email"
        @keypress="keypress.emailNoThai($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import keypress from '@/utils/Keypress'
import type { IFormState } from '@/models/Form.model'
import type { ICreateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PhoneNumberInput from '@/components/input/PhoneNumberInput.vue'
import Switch from '@/components/input/Switch.vue'
import CustomerGroupSelection from '@/components/selection/modules/customer-group/CustomerGroupSelection.vue'
import CustomerOccupationSelection from '@/components/selection/modules/customer-occupation/CustomerOccupationSelection.vue'
import TitleNameSelection from '@/components/selection/TitleNameSelection.vue'
import { useFormInitialValues } from '../schema/customer.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const model = defineModel<ICreateCustomerPayload>({
  default: useFormInitialValues()
})

const isActive = computed({
  get (): boolean {
    return model.value?.customerStatus === 'ACTIVE' ? true : false
  },
  set (value: boolean): void {
    model.value.customerStatus = value ? 'ACTIVE' : 'IN_ACTIVE'
  }
})
</script>

<style scoped>

</style>
