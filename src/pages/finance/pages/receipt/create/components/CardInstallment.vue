<template>
  <div class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-col gap-4 w-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between bg-[#f2f2f2] rounded-lg mx-4 mt-4 px-8 h-12">
      <div class="flex items-center gap-2">
        <Icon
          height="24"
          icon="fluent:apps-list-20-regular"
          width="24" />
        <span class="font-bold text-[#333] text-base">งวดที่ {{ installmentNo }}</span>
      </div>
      <div class="flex items-center">
        <CheckboxInput
          :model-value="selected"
          @update:model-value="onUserCheck($event)" />
        <div class="text-[#333] text-base">
          เลือกชำระ
        </div>
      </div>
      <!-- <span class="text-[#333] text-base">เลือกชำระ</span> -->
      <!-- <div
        class="flex items-center gap-2 cursor-pointer"
        @click="selected = !selected">
        <div
          :class="selected ? 'border-[#BD0102] bg-[#BD0102]' : 'border-[#BD0102]'"
          class="w-4 h-4 border-2 rounded-sm flex items-center justify-center bg-white">
          <Icon
            v-if="selected"
            class="text-white"
            height="10"
            icon="material-symbols:check"
            width="10" />
        </div>
        <span class="text-[#333] text-base">เลือกชำระ</span>
      </div> -->
    </div>

    <!-- Divider -->
    <hr class="border-[#e0e0e0] mx-4 my-0">

    <!-- Status row -->
    <div class="flex items-center justify-between mx-4">
      <div class="flex items-center gap-2">
        <Icon
          class="text-[#333]"
          height="24"
          icon="material-symbols-light:find-in-page-outline-rounded"
          width="24" />
        <span class="text-[#333] text-base">สถานะ</span>
      </div>
      <ChipInstallmentStatus :value="(data.status as TInstallmentStatus)" />
    </div>

    <!-- Due date row -->
    <div class="flex items-center justify-between mx-4">
      <div class="flex items-center gap-2">
        <Icon
          class="text-[#333]"
          height="24"
          icon="proicons:calendar"
          width="24" />
        <span class="text-[#333] text-base">กำหนดชำระ</span>
      </div>
      <span class="text-[#333] text-base">{{ formattedDate }}</span>
    </div>

    <!-- OVERDUE: penalty + discount -->
    <template v-if="isOverdue">
      <hr class="border-[#e0e0e0] mx-4 my-0">

      <!-- Penalty row -->
      <div class="flex items-center justify-between mx-4">
        <div class="flex items-center gap-2">
          <Icon
            class="text-[#333]"
            height="24"
            icon="fluent:clock-warning-24-regular"
            width="24" />
          <span class="text-[#333] text-base">ค่าปรับ</span>
        </div>
        <span class="text-[#333] text-base">{{ formatter.numberFormat(data.penaltyFee.outstanding) }}</span>
      </div>

      <!-- Discount row -->
      <div class="flex items-center gap-4 mx-4">
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="fineDiscount = !fineDiscount">
          <div
            :class="fineDiscount ? 'border-[#BD0102] bg-[#BD0102]' : 'border-[#BD0102]'"
            class="w-4 h-4 border-2 rounded-sm flex items-center justify-center bg-white">
            <Icon
              v-if="fineDiscount"
              class="text-white"
              height="10"
              icon="material-symbols:check"
              width="10" />
          </div>
          <span class="text-base text-[#333]">ส่วนลดค่าปรับ</span>
        </div>
        <div class="flex-1">
          <input
            v-model.number="discountAmount"
            :disabled="!fineDiscount"
            class="w-full h-10 border border-[#bdbdbd] rounded-md px-3 text-base text-[#333] outline-none bg-white disabled:bg-[#f2f2f2]"
            placeholder="0"
            type="number">
        </div>
      </div>
    </template>

    <!-- Divider -->
    <hr class="border-[#e0e0e0] mx-4 my-0">

    <!-- Full amount option -->
    <div
      :class="paymentType === 'full' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
      class="mx-4 flex items-center justify-between border rounded-lg px-[18px] py-[15px] cursor-pointer"
      @click="paymentType = 'full'">
      <div class="flex items-center gap-4">
        <div
          :class="paymentType === 'full' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
          <div
            v-if="paymentType === 'full'"
            class="w-2 h-2 rounded-full bg-[#BD0102]" />
        </div>
        <span class="text-[#333] text-base">ยอดชำระเต็มจำนวน</span>
      </div>
      <span class="text-[#333] text-base">{{ formatter.numberFormat(fullAmount) }}</span>
    </div>

    <!-- Custom amount option -->
    <div
      :class="paymentType === 'custom' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
      class="mx-4 flex items-center justify-between border rounded-lg px-[18px] py-2 cursor-pointer"
      @click="paymentType = 'custom'">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div
          :class="paymentType === 'custom' ? 'border-[#BD0102]' : 'border-[#bdbdbd]'"
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0">
          <div
            v-if="paymentType === 'custom'"
            class="w-2 h-2 rounded-full bg-[#BD0102]" />
        </div>
        <span class="text-[#333] text-base shrink-0">ระบุจำนวนเงิน</span>
      </div>
      <div
        class="border border-[#bdbdbd] rounded h-10 flex items-center justify-end px-4 w-[197px]"
        @click.stop>
        <input
          v-model.number="customAmount"
          class="w-full text-right text-base text-[#333] outline-none bg-transparent"
          type="number"
          @click="paymentType = 'custom'">
      </div>
    </div>

    <!-- Detail table (expandable) -->
    <div
      v-if="isExpanded"
      class="mx-4 flex border border-[#e0e0e0] rounded overflow-hidden">
      <!-- Column: รายการ -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center px-4">
          <span class="font-bold text-[#333] text-sm">รายการ</span>
        </div>
        <div
          v-for="(row, i) in tableRows"
          :key="`label-${i}`"
          :class="i === tableRows.length - 1 ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 flex items-center px-4 border-b border-[#e0e0e0]">
          <span
            :class="i === tableRows.length - 1 ? 'font-bold' : ''"
            class="text-[#333] text-sm">{{ row.label }}</span>
        </div>
      </div>

      <!-- Column: ยอด -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-4">
          <span class="font-bold text-[#333] text-sm">ยอด</span>
        </div>
        <div
          v-for="(row, i) in tableRows"
          :key="`amount-${i}`"
          :class="i === tableRows.length - 1 ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 flex items-center justify-end px-4 border-b border-[#e0e0e0]">
          <span
            :class="i === tableRows.length - 1 ? 'font-bold' : ''"
            class="text-[#333] text-sm">{{ formatter.numberFormat(row.amount) }}</span>
        </div>
      </div>

      <!-- Column: ชำระแล้ว -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-4">
          <span class="font-bold text-[#333] text-sm">ชำระแล้ว</span>
        </div>
        <div
          v-for="(row, i) in tableRows"
          :key="`paid-${i}`"
          :class="i === tableRows.length - 1 ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 flex items-center justify-end px-4 border-b border-[#e0e0e0]">
          <span
            :class="i === tableRows.length - 1 ? 'font-bold' : ''"
            class="text-[#333] text-sm">{{ formatter.numberFormat(row.paid) }}</span>
        </div>
      </div>

      <!-- Column: คงเหลือ -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 flex items-center justify-end px-4">
          <span class="font-bold text-[#333] text-sm">คงเหลือ</span>
        </div>
        <div
          v-for="(row, i) in tableRows"
          :key="`remaining-${i}`"
          :class="i === tableRows.length - 1 ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 flex items-center justify-end px-4 border-b border-[#e0e0e0]">
          <span
            :class="i === tableRows.length - 1 ? 'font-bold' : ''"
            class="text-[#333] text-sm">{{ formatter.numberFormat(row.remaining) }}</span>
        </div>
      </div>
    </div>

    <!-- Expand/collapse button -->
    <div
      class="flex justify-center items-center gap-2 mb-4 cursor-pointer"
      @click="isExpanded = !isExpanded">
      <span class="text-[#BD0102] text-base underline">รายละเอียดประจำงวด</span>
      <Icon
        :class="isExpanded ? 'rotate-180' : ''"
        class="text-[#BD0102] transition-transform"
        height="16"
        icon="mdi:chevron-down"
        width="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IReceiptInstallmentCreate } from '@/models/response/receipt/ReceiptRes.model'
import { type TInstallmentStatus } from '@/enums/modules/finance/InstallmentStatus.enum'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import { Icon } from '@iconify/vue'
import ChipInstallmentStatus from './ChipInstallmentStatus.vue'

interface IDetailRow {
  label: string
  amount: number
  paid: number
  remaining: number
}

interface IInstallmentChangePayload {
  amount: number
  discountPenaltyFee: number
}

interface IProps {
  data: IReceiptInstallmentCreate
  installmentNo: number
  selectAll?: boolean
  selectAllTick?: number
  initialSelected?: boolean
}

interface IEmits {
  change: [payload: IInstallmentChangePayload]
  select: [selected: boolean]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const selected = ref<boolean>(false)
const paymentType = ref<'full' | 'custom'>('full')
const customAmount = ref<number>(0)
const fineDiscount = ref<boolean>(false)
const discountAmount = ref<number>(0)
const isExpanded = ref<boolean>(false)

const isOverdue = computed((): boolean => props.data.status === 'OVERDUE')

const fullAmount = computed((): number => {
  const discount = fineDiscount.value ? discountAmount.value : 0
  return props.data.total.outstanding - discount
})

const formattedDate = computed((): string => dayjs.formatDate(props.data.dueDate))

const tableRows = computed((): IDetailRow[] => [
  {
    label: 'ค่าปรับ',
    amount: props.data.penaltyFee.total,
    paid: props.data.penaltyFee.paid,
    remaining: props.data.penaltyFee.outstanding
  },
  {
    label: 'ค่าติดตาม',
    amount: props.data.collectionFee.total,
    paid: props.data.collectionFee.paid,
    remaining: props.data.collectionFee.outstanding
  },
  {
    label: 'ค่าทนาย',
    amount: props.data.legalFee.total,
    paid: props.data.legalFee.paid,
    remaining: props.data.legalFee.outstanding
  },
  {
    label: 'ดอกเบี้ย',
    amount: props.data.interest.total,
    paid: props.data.interest.paid,
    remaining: props.data.interest.outstanding
  },
  {
    label: 'เงินต้น',
    amount: props.data.principal.total,
    paid: props.data.principal.paid,
    remaining: props.data.principal.outstanding
  },
  {
    label: 'รวม',
    amount: props.data.total.total,
    paid: props.data.total.paid,
    remaining: props.data.total.outstanding
  }
])

const currentAmount = computed((): number => {
  if (!selected.value) return 0
  return paymentType.value === 'full' ? fullAmount.value : customAmount.value
})

const currentDiscount = computed((): number => {
  if (!selected.value || !fineDiscount.value) return 0
  return discountAmount.value
})

watch((): number | undefined => props.selectAllTick, (): void => {
  if (props.selectAll !== undefined) selected.value = props.selectAll
})

function onUserCheck (val: boolean): void {
  selected.value = val
  emits('select', val)
}

watch(currentAmount, (val: number): void => {
  emits('change', { amount: val, discountPenaltyFee: currentDiscount.value })
})

watch(currentDiscount, (val: number): void => {
  emits('change', { amount: currentAmount.value, discountPenaltyFee: val })
})

onMounted((): void => {
  selected.value = props.initialSelected ?? false
  customAmount.value = props.data.total.outstanding
  emits('change', { amount: currentAmount.value, discountPenaltyFee: currentDiscount.value })
  if (props.initialSelected) emits('select', true)
})
</script>

<style scoped>

</style>
