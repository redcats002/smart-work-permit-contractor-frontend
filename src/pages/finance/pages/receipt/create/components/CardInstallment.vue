<template>
  <BaseContainer>
    <div class="flex align-items-center gap-2 mb-3">
      <CheckboxInput
        variant="primary" />
      <span>เลือกชำระ</span>
    </div>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value}">
        <ChipInstallmentStatus :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IReceiptInstallment } from '@/models/response/receipt/ReceiptRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import ChipInstallmentStatus from './ChipInstallmentStatus.vue'

interface IProps {
  data: IReceiptInstallment
}

const props = defineProps<IProps>()

const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  const isPartiallyPaid = props.data.status === 'PARTIALLY_PAID'

  const base: IDisplayList[] = [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่สัญญา', key: 'contractNo', value: props.data.contractNo },
    { label: `ค่างวด ${dayjs.formatDate(props.data.installmentDate)}`, key: 'installmentPrice', value: formatter.numberFormat(props.data.installmentPrice) },
    { label: 'ค่าปรับ', key: 'interest', value: formatter.numberFormat(props.data.interest) }
  ]

  if (isPartiallyPaid) {
    base.push(
      { label: 'ชำระแล้ว', key: 'paid', value: props.data.paid }, { label: 'คงเหลือ', key: 'outstanding', value: formatter.numberFormat(props.data.outstanding) }
    )
  }

  return base
})

</script>

<style scoped>

</style>
