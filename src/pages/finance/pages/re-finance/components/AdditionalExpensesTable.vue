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
          v-for="(row, i) in displayRows"
          :key="`label-${i}`"
          :class="row.isTotal ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 px-4 py-2 flex items-center w-full border-b-[0.5px] border-[#e0e0e0]">
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
          v-for="(row, i) in displayRows"
          :key="`total-${i}`"
          :class="row.isTotal ? 'bg-[#e0e0e0]' : 'bg-white'"
          class="h-14 px-4 py-2 flex items-center justify-end gap-2 w-full border-b-[0.5px] border-[#e0e0e0]">
          <span
            v-if="row.isTotal"
            class="text-sm text-[#333]"
            style="font-weight: 800; text-decoration: underline;">
            {{ formatter.numberFormat2Decimal(row.amount) }}
          </span>
          <template v-else>
            <span class="text-sm font-normal text-[#333]">{{ formatter.numberFormat2Decimal(row.amount) }}</span>
            <button
              aria-label="แก้ไขรายการ"
              class="flex items-center justify-center cursor-pointer hover:opacity-70"
              type="button"
              @click="emits('edit', i)">
              <div class="relative size-4">
                <div class="absolute inset-0 rounded-full bg-blue-500/10" />
                <Icon
                  class="absolute inset-0 m-auto size-3 text-blue-500"
                  icon="solar:pen-linear" />
              </div>
            </button>
            <DeleteModal
              description1="กดยืนยันเพื่อทำการลบ"
              description2=""
              title="ยืนยันการดำเนินการ"
              @confirm="emits('remove', i)">
              <template #activator="{ open }">
                <button
                  aria-label="ลบรายการ"
                  class="flex items-center justify-center cursor-pointer hover:opacity-70"
                  type="button"
                  @click="open()">
                  <div class="relative size-4">
                    <div class="absolute inset-0 rounded-full bg-[#bd0102]/10" />
                    <Icon
                      class="absolute inset-0 m-auto size-3 text-[#bd0102]"
                      icon="solar:trash-bin-2-linear" />
                  </div>
                </button>
              </template>
            </DeleteModal>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import { Icon } from '@iconify/vue'
import DeleteModal from '@/components/modal/DeleteModal.vue'

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
  edit: [index: number]
  remove: [index: number]
}

const props = withDefaults(defineProps<IProps>(), {
  rows: (): IAdditionalExpenseRow[] => [
    { label: 'ค่าประกันไถ่ถอน ที่ดิน', amount: 500 },
    { label: 'ค่าเบี้ยปรับ', amount: 500 },
    { label: 'ค่ายกเลิกสัญญา', amount: 500 }
  ]
})

const emits = defineEmits<IEmits>()

const displayRows = computed((): IAdditionalExpenseRow[] => {
  const dataRows = props.rows.filter((r: IAdditionalExpenseRow): boolean => !r.isTotal)
  const total = dataRows.reduce((sum: number, r: IAdditionalExpenseRow): number => sum + r.amount, 0)
  return [...dataRows, { label: 'รวม', amount: total, isTotal: true }]
})
</script>
