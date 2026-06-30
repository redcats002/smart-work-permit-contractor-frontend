<template>
  <div class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-col gap-4 p-4 w-full">
    <div class="bg-[#f2f2f2] h-12 flex items-center justify-between px-8 rounded-lg">
      <div class="flex items-center gap-2">
        <Icon
          class="size-6 text-[#bd0102]"
          icon="fluent:apps-list-20-regular" />
        <span class="text-base font-bold text-[#333]">รายการค่าใช้จ่ายอื่นๆ</span>
      </div>
      <button
        class="bg-white border border-[#bd0102] flex items-center gap-2.5 h-10 px-6 rounded-lg hover:bg-[#fff5f5] cursor-pointer"
        type="button"
        @click="emits('add')">
        <Icon
          class="size-6 text-[#bd0102]"
          icon="ic:twotone-add" />
        <span class="text-base font-normal text-[#bd0102] whitespace-nowrap">บันทึกค่าใช้จ่ายอื่นๆ</span>
      </button>
    </div>

    <hr class="border-t border-[#e0e0e0]">

    <div class="flex items-stretch w-full">
      <div class="flex flex-1 flex-col min-w-0">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 px-4 py-2 flex items-center w-full">
          <span class="text-sm font-bold text-[#333]">รายการ</span>
        </div>
        <div
          v-for="(row, i) in rows"
          :key="`label-${i}`"
          :class="row.isTotal ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 px-4 py-2 flex items-center w-full border-b border-[#e0e0e0]">
          <span
            :class="row.isTotal ? 'font-bold' : 'font-normal'"
            class="text-sm text-[#333]">
            {{ row.label }}
          </span>
        </div>
      </div>

      <div class="flex flex-1 flex-col min-w-0 items-end">
        <div class="bg-white border-b-2 border-[#e0e0e0] h-12 px-4 py-2 flex flex-col items-end justify-center w-full">
          <span class="text-sm font-bold text-[#333]">รวม</span>
        </div>
        <div
          v-for="(row, i) in rows"
          :key="`total-${i}`"
          :class="row.isTotal ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 px-4 py-2 flex items-center justify-end gap-2 w-full border-b border-[#e0e0e0]">
          <span
            v-if="row.isTotal"
            class="text-sm text-[#333]"
            style="font-weight: 800; text-decoration: underline;">
            {{ formatNumber(row.amount) }}
          </span>
          <template v-else>
            <span class="text-sm font-normal text-[#333]">{{ formatNumber(row.amount) }}</span>
            <button
              aria-label="ลบรายการ"
              class="size-4 flex items-center justify-center text-[#bd0102] hover:opacity-70 cursor-pointer"
              type="button"
              @click="emits('remove', i)">
              <Icon
                class="size-4"
                icon="ic:baseline-delete" />
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatter } from '@/utils/Formatter'
import { Icon } from '@iconify/vue'

export interface IAdditionalExpenseRow {
  label: string
  amount: number
  isTotal?: boolean
}

interface IProps {
  rows?: IAdditionalExpenseRow[]
}

interface IEmits {
  add: []
  remove: [index: number]
}

withDefaults(defineProps<IProps>(), {
  rows: (): IAdditionalExpenseRow[] => [
    { label: 'ค่าประกันไถ่ถอน ที่ดิน', amount: 500 },
    { label: 'ค่าเบี้ยปรับ', amount: 500 },
    { label: 'ค่ายกเลิกสัญญา', amount: 500 },
    { label: 'รวม', amount: 1500, isTotal: true }
  ]
})

const emits = defineEmits<IEmits>()

function formatNumber (value: number): string {
  return formatter.numberFormat(value)
}
</script>
