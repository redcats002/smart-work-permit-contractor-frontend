<template>
  <BaseContainer>
    <!-- Customer selection -->
    <div class="flex flex-col gap-1 mb-4">
      <div class="flex items-center gap-1 text-sm font-bold text-[#333]">
        <span>ลูกค้า</span>
        <span class="text-[#BD0102]">*</span>
      </div>
      <ModalCustomerSelection
        v-model="customerId"
        :disabled="!!customerIdQuery"
        placeholder="กรุณาเลือกลูกค้า"
        show-clear
        @update:model-value="onSelectionChange()" />
    </div>

    <!-- Customer details -->
    <DisplayList
      v-if="data.id"
      :items="items">
      <template #[`value.status`]="{ value }">
        <ChipCustomerStatus :value="value" />
      </template>
      <template #[`value.idCard`]="{ value }">
        <CitizenId :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ModalCustomerSelection from '@/components/selection/modules/api/customer/ModalCustomerSelection.vue'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'

interface IProps {
  data: ICustomerById
  customerIdQuery?: number | null
}

interface IEmits {
  change: [id: number | null]
}

const props = withDefaults(defineProps<IProps>(), {
  customerIdQuery: null
})
const emits = defineEmits<IEmits>()

const customerId = defineModel<number | null>('customerId', { default: null })

const dayjs = useDayjs()

function onSelectionChange (): void {
  emits('change', customerId.value)
}

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'idNo', value: props.data.idNo },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data.idCard },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: dayjs.formatDate(props.data.birthDate) },
    { label: 'อายุ', key: 'age', value: props.data?.birthDate ? dayjs.formatAge(props.data?.birthDate) : '-' },
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: props.data.customerGroup?.name || '-' },
    { label: 'อาชีพ', key: 'occupation', value: props.data.occupation?.name || '-' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: props.data.phoneNumber },
    { label: 'อีเมล', key: 'email', value: props.data.email }
  ]
})
</script>

<style scoped>

</style>
