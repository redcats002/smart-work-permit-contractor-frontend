<template>
  <BaseContainer>
    <!-- Customer selection display -->
    <div class="flex flex-col gap-1 mb-4">
      <div class="flex items-center gap-1 text-sm font-bold text-[#333]">
        <span>ลูกค้า</span>
        <span class="text-[#BD0102]">*</span>
      </div>
      <div class="flex items-center border border-[#e0e0e0] rounded-lg px-3 h-8 gap-2">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <Icon
            class="shrink-0 text-[#333]"
            height="16"
            icon="solar:user-linear"
            width="16" />
          <span class="text-sm text-[#333] truncate">{{ customerName }}</span>
        </div>
        <button
          class="shrink-0"
          type="button"
          @click="emits('clear')">
          <Icon
            class="text-[#333]"
            height="16"
            icon="material-symbols:close"
            width="16" />
        </button>
      </div>
    </div>

    <!-- Customer details -->
    <DisplayList :items="items">
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
import { formatter } from '@/utils/Formatter'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipCustomerStatus from '@/pages/customer/pages/list/components/ChipCustomerStatus.vue'
import { Icon } from '@iconify/vue'

interface IProps {
  data: ICustomerById
}

interface IEmits {
  clear: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const customerName = computed((): string => formatter.fullName(props.data))

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'id', value: props.data.id },
    { label: 'เลขบัตรประชาชน', key: 'idCard', value: props.data.idCard },
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
