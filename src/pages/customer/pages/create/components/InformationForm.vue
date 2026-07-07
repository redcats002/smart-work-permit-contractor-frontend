<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="md:col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน"
        handle />
      <div
        class="md:grid md:grid-cols-3 md:col-span-3">
        <LabelField
          label="ประเภทบุคคล"
          tag="div"
          hide-error
          required>
          <div class="flex items-center gap-5">
            <div
              v-for="(item, i) in PersonalTypeItems"
              :key="`${item.value}-${i}`"
              class="flex items-center gap-2 cursor-pointer">
              <RadioButton
                v-model="model.personalType"
                :disabled="disablePersonalType"
                :value="item.value"
                name="personalType" />
              <span class="text-sm">{{ item.label }}</span>
            </div>
          </div>
        </LabelField>
      </div>

      <LabelField
        v-model="model.idCard"
        :form="form"
        :label="isCorporate ? 'เลขประจำตัวผู้เสียภาษี' : 'เลขบัตรประชาชน'"
        name="idCard"
        placeholder="X-XXXX-XXXXX-XX-X"
        hide-error
        required
        @keypress="keypress.thaiCitizenId"
        @paste="handlePasteIdCard($event)" />
      <LabelField
        v-if="isCorporate"
        v-model="model.firstName"
        :class="{
          'md:col-span-2': isCorporate,
        }"
        :form="form"
        label="ชื่อ"
        name="firstName"
        placeholder="บริษัท"
        hide-error
        required />
      <LabelField
        v-else
        v-model="model.firstName"
        v-model:prepend-option="model.titleName"
        :form="form"
        :prepend-options="TitleNameItems"
        label="ชื่อ"
        name="firstName"
        name-prepend-option="titleName"
        placeholder="กรอกชื่อ"
        hide-error
        required />
      <LabelField
        v-if="!isCorporate"
        v-model="model.lastName"
        :form="form"
        label="นามสกุล"
        name="lastName"
        placeholder="กรอกนามสกุล"
        hide-error
        required />
      <LabelField
        v-if="!isCorporate"
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
          name="birthDate"
          placeholder="DD/MM/YYYY" />
      </LabelField>
      <div
        :class="{
          'md:grid md:grid-cols-3 md:col-span-3': isCorporate
        }">
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
      </div>
      <LabelField
        v-if="!isCorporate"
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
        placeholder="email@mail.com"
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
import { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import { PersonalTypeEnum, PersonalTypeItems } from '@/enums/modules/customer/PersonalType.enum'
import { TitleNameItems } from '@/enums/TitleName.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PhoneNumberInput from '@/components/input/PhoneNumberInput.vue'
import Switch from '@/components/input/Switch.vue'
import CustomerGroupSelection from '@/components/selection/modules/api/customer-group/CustomerGroupSelection.vue'
import CustomerOccupationSelection from '@/components/selection/modules/api/customer-occupation/CustomerOccupationSelection.vue'
import { type CustomerFormValues, useFormInitialValues } from '../schema/customer.schema'

interface IProps {
  form?: IFormState
  disablePersonalType?: boolean
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  disablePersonalType: false
})

const dayjs = useDayjs()

const model = defineModel<CustomerFormValues>({
  default: (): CustomerFormValues => useFormInitialValues()
})
const formKey = defineModel<number>('formKey', { required: true })

const isCorporate = computed((): boolean => model.value?.personalType === PersonalTypeEnum.CORPORATE)

const isActive = computed({
  get (): boolean {
    return model.value?.status === CustomerStatusEnum.ACTIVE ? true : false
  },
  set (value: boolean): void {
    model.value.status = value ? CustomerStatusEnum.ACTIVE : CustomerStatusEnum.INACTIVE
  }
})

function handlePasteNumber (evt: ClipboardEvent, key: keyof CustomerFormValues): void {
  model.value[key] = ''
  model.value[key] = paste.citizenId(evt)
  formKey.value++
}

function handlePasteIdCard (evt: ClipboardEvent): void {
  handlePasteNumber(evt, 'idCard')
}
</script>

<style scoped>

</style>
