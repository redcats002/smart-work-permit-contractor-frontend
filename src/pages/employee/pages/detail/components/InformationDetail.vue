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
          <span>{{ visibleCitizenId ? value : '*************' }}</span>
          <Icon
            :icon="visibleCitizenId ? 'famicons:eye-outline' : 'famicons:eye-off-outline'"
            class="cursor-pointer"
            color="#BD0102"
            @click="toggleVisibleCitizenId()" />
        </template>
      </DisplayList>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import { Icon } from '@iconify/vue'
import EmployeeDetailMenuAction from './EmployeeDetailMenuAction.vue'
import ChipEmployeeStatus from '../../list/components/ChipEmployeeStatus.vue'

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
const visibleCitizenId = ref<boolean>(true)

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'id', value: props.data.id },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data.idCard },
    { label: 'ชื่อ', key: 'name', value: `${props.data.titleName} ${props.data.firstName} ${props.data.lastName}` },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(props.data.birthDate) },
    { label: 'อายุ', key: 'age', value: dayjs.formatAge(props.data.birthDate) },
    { label: 'อีเมล', key: 'email', value: props.data.email },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'ตำแหน่ง', key: 'role', value: props.data.role },
    { label: 'สาขา', key: 'branchId', value: props.data.branchId }
  ]
})

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}

</script>

<style scoped>

</style>
