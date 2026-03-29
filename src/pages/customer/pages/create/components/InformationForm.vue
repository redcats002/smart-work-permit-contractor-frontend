<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน"
        handle />
      <LabelField
        v-model="model.idCard"
        :form="form"
        label="เลขบัตรประชาชน"
        name="idCard"
        hide-error
        required
        @keypress="keypress.thaiCitizenId"
        @paste="handlePasteIdCard($event)" />
      <div class="w-full grid grid-cols-2 gap-5">
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          label="คำนำหน้า"
          name="titleName"
          hide-error>
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
          hide-error
          required />
      </div>
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
        name="birthDate"
        hide-error
        required>
        <DatePickerInput
          v-model="model.birthDate"
          :invalid="invalid"
          :max-date="dayjs().toDate()"
          name="birthDate" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="กลุ่มลูกค้า"
        name="customerGroupId"
        hide-error>
        <CustomerGroupSelection
          v-model="model.customerGroupId"
          :invalid="invalid"
          show-clear />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="อาชีพ"
        name="jobId"
        hide-error>
        <CustomerOccupationSelection
          v-model="model.occupationId"
          :invalid="invalid"
          show-clear />
      </LabelField>
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
        label="เบอร์โทร 2"
        name="phoneNumber2"
        hide-error>
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
        hide-error
        @keypress="keypress.emailNoThai($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import keypress from '@/utils/Keypress'
import paste from '@/utils/Paste'
import type { IFormState } from '@/models/Form.model'
import type { ICreateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PhoneNumberInput from '@/components/input/PhoneNumberInput.vue'
import Switch from '@/components/input/Switch.vue'
import CustomerGroupSelection from '@/components/selection/modules/api/customer-group/CustomerGroupSelection.vue'
import CustomerOccupationSelection from '@/components/selection/modules/api/customer-occupation/CustomerOccupationSelection.vue'
import TitleNameSelection from '@/components/selection/modules/static/TitleNameSelection.vue'
import { useFormInitialValues } from '../schema/customer.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const dayjs = useDayjs()

const model = defineModel<ICreateCustomerPayload>({
  default: useFormInitialValues()
})
const formKey = defineModel<number>('formKey', { required: true })

const isActive = computed({
  get (): boolean {
    return model.value?.status === CustomerStatusEnum.ACTIVE ? true : false
  },
  set (value: boolean): void {
    model.value.status = value ? CustomerStatusEnum.ACTIVE : CustomerStatusEnum.INACTIVE
  }
})

function handlePasteNumber (evt: ClipboardEvent, key: keyof ICreateCustomerPayload): void {
  model.value[key] = ''
  model.value[key] = paste.number(evt)
  formKey.value++
}

function handlePasteIdCard (evt: ClipboardEvent): void {
  handlePasteNumber(evt, 'idCard')
}
</script>

<style scoped>

</style>
