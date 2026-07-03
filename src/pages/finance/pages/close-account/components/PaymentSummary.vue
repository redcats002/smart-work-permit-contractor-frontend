<template>
  <div class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] p-4 w-full">
    <div class="flex flex-col gap-2 items-end">
      <SummaryRow
        :value="principal"
        label="เงินต้น" />
      <SummaryRow
        :value="interest"
        label="ดอกเบี้ย" />
      <SummaryRow
        :value="otherExpenses"
        label="ค่าใช้จ่ายอื่นๆ" />

      <div class="flex gap-[10px] h-[40px] items-center w-[312px]">
        <span class="text-[14px] font-bold text-[#333] whitespace-nowrap">ส่วนลดดอกเบี้ย</span>
        <input
          v-model.number="interestDiscountMonth"
          class="bg-white border border-[#bdbdbd] h-[40px] w-[57px] rounded-[4px] text-[14px] text-center focus:outline-none focus:border-[#bd0102]"
          type="number">
        <span class="text-[14px] font-normal text-[#333] whitespace-nowrap">เดือน</span>
        <span class="text-[14px] font-normal text-[#333] whitespace-nowrap">:</span>
        <span class="text-[14px] font-normal text-[#333] whitespace-nowrap">{{ formatNumber(interestDiscountValue) }}</span>
      </div>

      <div class="flex gap-[10px] h-[40px] items-center w-[260px]">
        <span class="text-[14px] font-bold text-[#333] w-[148px] whitespace-nowrap">ส่วนลดอื่นๆ</span>
        <span class="text-[14px] font-bold text-[#333] whitespace-nowrap">:</span>
        <input
          v-model.number="otherDiscount"
          class="bg-white border border-[#bdbdbd] flex-1 h-[40px] min-w-0 rounded-[4px] text-[14px] px-2 focus:outline-none focus:border-[#bd0102]"
          type="number">
      </div>

      <SummaryRow
        :value="grandTotal"
        label="ยอดชำระรวม"
        bold />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import SummaryRow from './SummaryRow.vue'

interface IProps {
  principal?: number
  interest?: number
  otherExpenses?: number
  interestDiscountPerMonth?: number
}

const props = withDefaults(defineProps<IProps>(), {
  principal: 80000,
  interest: 12000,
  otherExpenses: 0,
  interestDiscountPerMonth: 0
})

const interestDiscountMonth = ref<number | string>(props.interestDiscountPerMonth)
const otherDiscount = ref<number | string>(0)

const interestDiscountValue = computed<number>((): number => {
  const months = Number(interestDiscountMonth.value) || 0
  return months * 1500
})

const grandTotal = computed<number>((): number => {
  const total = props.principal + props.interest + props.otherExpenses - interestDiscountValue.value - (Number(otherDiscount.value) || 0)
  return Math.max(total, 0)
})

function formatNumber (value: number): string {
  return formatter.numberFormat(value)
}
</script>
