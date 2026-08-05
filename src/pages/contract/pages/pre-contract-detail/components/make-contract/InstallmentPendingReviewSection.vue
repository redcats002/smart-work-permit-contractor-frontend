<template>
  <div class="flex flex-col gap-5">
    <BaseContainer>
      <DisplayList :items="displayItems" />
    </BaseContainer>
    <InstallmentTable
      v-if="schedule?.length"
      :items="schedule" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import { type InterestTypeEnum, type TInterestType, formatTitle } from '@/enums/modules/contract/InterestType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import { type IInstallmentRow, useInstallment } from '../../composables/make-contract/useInstallment'
import { type InstallmentFormValues } from '../../schema/make-contract.schema'
import InstallmentTable from './InstallmentTable.vue'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { IContractLoanTypeList } from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'

interface IInstallmentContract {
  status: TPreContractStatus
  refinanceAmount?: number
  loanAmount: number
  installmentCount: number
  interestType?: TInterestType
  annualInterestRate: number
  lateFee: number
  contractedAt?: string
  sellMan?: IEmployeeList
  contractLoanType: IContractLoanTypeList
}

interface IProps {
  contract: IInstallmentContract
  isRefinance?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  isRefinance: false
})

const form = defineModel<InstallmentFormValues>({ required: true })
const schedule = ref<IInstallmentRow[]>([])
const monthlyPayment = ref<number>(0)
const totalInterest = ref<number>(0)
const formKey = ref<number>(0)
const { formatDate } = useDayjs()

const displayItems = computed((): IDisplayList[] => [
  { key: 'contractLoanType', label: 'ประเภทเงินกู้', value: props.contract.contractLoanType.name },
  { key: 'contractedAt', label: 'วันที่เริ่ม', value: formatDate(schedule.value[0]?.dueDate ?? '') },
  { key: 'installmentCount', label: 'จำนวนงวดของการกู้ยืม', value: props.contract.installmentCount },
  { key: 'loanAmount', label: 'จำนวนเงินที่ต้องการกู้', value: formatter.numberFormat2Decimal(props.contract.loanAmount) },
  { key: 'interestType', label: 'ประเภทดอกเบี้ย', value: formatTitle(props.contract.interestType) },
  { key: 'annualInterestRate', label: 'อัตราดอกเบี้ยเงินกู้ต่อปี', value: `${formatter.numberFormat2Decimal(props.contract.annualInterestRate)}%` },
  { key: 'lateFee', label: 'ค่าปรับกรณีล่าช้า', value: formatter.numberFormat2Decimal(props.contract.lateFee) },
  { key: 'monthlyInstallment', label: 'ชำระเดือนละ', value: formatter.numberFormat2Decimal(monthlyPayment.value) },
  { key: 'finalInstallment', label: 'ชำระงวดสุดท้าย', value: formatter.numberFormat2Decimal(schedule.value[schedule.value.length - 1]?.installment ?? 0) },
  { key: 'totalInterest', label: 'ดอกเบี้ยรวม', value: formatter.numberFormat2Decimal(totalInterest.value) }
])

async function recalculate (): Promise<void> {
  await nextTick()
  const v = form.value
  if (!v.loanAmount || !v.installmentCount || v.installmentCount <= 0) {
    schedule.value = []
    monthlyPayment.value = 0
    totalInterest.value = 0
    return
  }
  schedule.value = useInstallment({
    loanAmount: v.loanAmount,
    installmentCount: v.installmentCount,
    interestType: v.interestType as InterestTypeEnum,
    annualInterestRate: v.annualInterestRate,
    contractedAt: props.contract.contractedAt ? new Date(props.contract.contractedAt) : new Date()
  })
  monthlyPayment.value = schedule.value[0]?.installment ?? 0
  totalInterest.value = schedule.value.reduce((acc: number, row: IInstallmentRow): number => acc + row.interest, 0)
  form.value.lateFee = Math.floor((v.loanAmount * 0.05) / 365)
  mount()
}

function useInit (): void {
  form.value = {
    loanAmount: props.isRefinance ? (props.contract?.refinanceAmount || 0) : props.contract.loanAmount,
    installmentCount: props.contract.installmentCount,
    interestType: props.contract.interestType,
    annualInterestRate: props.contract.annualInterestRate,
    lateFee: props.contract.lateFee
  }
  recalculate()
  mount()
}

function mount (): void {
  formKey.value++
}

watch(
  (): IInstallmentContract => props.contract, (): void => {
    useInit()
  }, { immediate: true }
)
</script>
