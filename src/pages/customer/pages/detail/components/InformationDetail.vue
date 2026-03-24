<template>
  <BaseContainer>
    <template #topright>
      <CustomerDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')" />
    </template>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value}">
        <ChipCustomerStatus :value="value" />
      </template>
      <template #[`value.idCard`]="{ value }">
        <CitizenId
          v-model="visibleCitizenId"
          :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipCustomerStatus from '../../list/components/ChipCustomerStatus.vue'
import CustomerDetailMenuAction from './CustomerDetailMenuAction.vue'

interface IProps {
  data: ICustomerById
}
interface IEmits {
  edit: []
  delete: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()
const visibleCitizenId = ref<boolean>(false)

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'idNo', value: props.data?.idNo },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data.idCard },
    { label: 'ชื่อ', key: 'name', value: `${props.data.titleName} ${props.data.firstName} ${props.data.lastName}` },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(props.data.birthDate) },
    { label: 'อายุ', key: 'age', value: dayjs.formatAge(props.data.birthDate) },
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: props.data.customerGroup?.name || '-' },
    { label: 'อาชีพ', key: 'occupation', value: props.data.occupation?.name || '-' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'อีเมล', key: 'email', value: props.data.email }
  ]
})


</script>

<style scoped>

</style>
