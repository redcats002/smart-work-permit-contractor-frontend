<template>
  <div class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex flex-col gap-4 p-4 w-full">
    <div class="bg-[#f2f2f2] h-12 flex items-center px-8 rounded-lg">
      <div class="flex items-center gap-2">
        <Icon
          class="size-6 text-[#bd0102]"
          icon="fluent:apps-list-20-regular" />
        <span class="text-base font-bold text-[#333]">รายการที่ต้องชำระ ปิดบัญชี</span>
      </div>
    </div>

    <hr class="border-t border-[#e0e0e0]">

    <div class="flex items-stretch w-full">
      <div
        v-for="(col, ci) in columns"
        :key="col.key"
        :class="ci === 0 ? 'items-start' : 'items-end justify-end'"
        class="flex flex-1 flex-col min-w-0">
        <div
          :class="ci === 0 ? 'justify-start px-4' : 'justify-end px-4'"
          class="bg-white border-b-2 border-[#e0e0e0] h-12 flex flex-col items-end py-2 w-full">
          <span class="text-sm font-bold text-[#333] whitespace-nowrap">{{ col.label }}</span>
        </div>
        <div
          v-for="(row, ri) in rows"
          :key="`${col.key}-${ri}`"
          :class="row.isTotal ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 px-4 py-2 flex items-center w-full border-b border-[#e0e0e0]">
          <span
            v-if="ci === 0"
            :class="row.isTotal ? 'font-bold' : ''"
            class="text-sm font-normal text-[#333]">
            {{ row.label }}
          </span>
          <span
            v-else
            :style="row.isTotal ? 'font-weight: 800; text-decoration: underline;' : ''"
            class="text-sm text-[#333] ml-auto">
            {{ formatNumber(row[col.key]) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatter } from '@/utils/Formatter'
import { Icon } from '@iconify/vue'

export type InstallmentRowKey = 'penalty' | 'collection' | 'lawyer' | 'principal' | 'interest' | 'total'

export interface IInstallmentRow {
  label: string
  penalty: number
  collection: number
  lawyer: number
  principal: number
  interest: number
  total: number
  isTotal?: boolean
}

interface IProps {
  rows?: IInstallmentRow[]
}

interface IColumn {
  key: InstallmentRowKey | 'label'
  label: string
}

const columns: IColumn[] = [
  { key: 'label', label: 'รายการ' },
  { key: 'penalty', label: 'ค่าปรับ' },
  { key: 'collection', label: 'ค่าติดตาม' },
  { key: 'lawyer', label: 'ค่าทนาย' },
  { key: 'principal', label: 'เงินต้น' },
  { key: 'interest', label: 'ดอกเบี้ย' },
  { key: 'total', label: 'รวม' }
]

withDefaults(defineProps<IProps>(), {
  rows: (): IInstallmentRow[] => [
    { label: 'งวดที่ 41', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 11500 },
    { label: 'งวดที่ 42', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 11500 },
    { label: 'งวดที่ 43', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 11500 },
    { label: 'งวดที่ 44', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 10000 },
    { label: 'งวดที่ 45', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 10000 },
    { label: 'งวดที่ 46', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 10000 },
    { label: 'งวดที่ 47', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 10000 },
    { label: 'งวดที่ 48', penalty: 0, collection: 0, lawyer: 0, principal: 10000, interest: 1500, total: 10000 },
    { label: 'รวม', penalty: 0, collection: 0, lawyer: 0, principal: 80000, interest: 12000, total: 83000, isTotal: true }
  ]
})

function formatNumber (value: number): string {
  return formatter.numberFormat(value)
}
</script>
