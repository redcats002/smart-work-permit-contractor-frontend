<template>
  <BaseContainer>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value}">
        <ChipCustomerStatus :value="value" />
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
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'
import { Icon } from '@iconify/vue'

interface IProps {
  data: ICustomerById
}

const props = defineProps<IProps>()

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
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: props.data.customerGroup?.name || '-' },
    { label: 'อาชีพ', key: 'occupation', value: props.data.occupation?.name || '-' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'อีเมล', key: 'email', value: props.data.email }
  ]
})

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}

</script>

<style scoped>

</style>
