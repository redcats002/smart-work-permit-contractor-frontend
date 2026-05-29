<template>
  <div class="grid gap-2.5">
    <BaseContainer>
      <DisplayList :items="items" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractById } from '@/models/response/contract/ContractRes.model'
import { formatTitle } from '@/enums/modules/contract/InterestType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'

interface IProps {
  data: IContractById
}
const props = defineProps<IProps>()
defineOptions({
  inheritAttrs: false
})

const { formatDate } = useDayjs()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'วันที่ทำสัญญา', key: 'createdAt', value: formatDate(props.data?.createdAt || '') },
    { label: 'ประเภทเงินกู้', key: 'contractLoanType', value: props.data.contractLoanType?.name },
    { label: 'วันที่เริ่ม', key: 'firstInstallmentDate', value: formatDate(props.data?.firstInstallmentDate || '') },
    { label: 'จำนวนงวดของการกู้ยืม', key: 'installmentCount', value: props.data?.installmentCount || 0 },
    { label: 'จำนวนเงินที่ต้องการกู้', key: 'loanAmount', value: formatter.numberFormat2Decimal(props.data.loanAmount) },
    { label: 'ประเภทดอกเบี้ย', key: 'interestType', value: formatTitle(props.data?.interestType) },
    { label: 'อัตราดอกเบี้ยเงินกู้ต่อปี', key: 'annualInterestRate', value: `${formatter.numberFormat2Decimal(props.data?.annualInterestRate)}%` },
    { label: 'ค่าปรับกรณีล่าช้า', key: 'lateFee', value: formatter.numberFormat(props.data?.lateFee) },
    { label: 'ชำระเดือนละ', key: 'monthlyInstallment', value: formatter.numberFormat2Decimal(props.data.monthlyInstallment) },
    { label: 'ชำระงวดสุดท้าย', key: 'finalInstallment', value: formatter.numberFormat2Decimal(props.data.finalInstallment) },
    { label: 'ดอกเบี้ยรวม', key: 'interestAmount', value: formatter.numberFormat2Decimal(props.data.totalInterest) }
  ]
})


</script>

<style scoped>

</style>
