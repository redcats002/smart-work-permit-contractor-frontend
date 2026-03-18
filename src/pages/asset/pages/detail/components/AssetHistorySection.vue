<template>
  <div
    ref="sectionRef"
    class="rounded-xl bg-white">
    <div class="flex items-center px-5 pt-4 pb-5">
      <button
        :class="activeTab === 'history' ? 'text-red-500 border-red-500' : 'text-surface-400 border-transparent'"
        class="text-sm font-bold pb-2 flex-1 text-center border-b-2"
        @click="setTab('history')">
        ประวัติการจัดเก็บเอกสาร
      </button>
      <button
        :class="activeTab === 'auction' ? 'text-red-500 border-red-500' : 'text-surface-400 border-transparent'"
        class="text-sm font-bold pb-2 flex-1 text-center border-b-2"
        @click="setTab('auction')">
        ขายต่อ/ประมูล
      </button>
    </div>
    <div class="px-5 pb-8">
      <Transition
        mode="out-in"
        name="tab-fade">
        <BaseTable
          v-if="activeTab === 'history'"
          key="history"
          :columns="columns"
          :items="items"
          :show-footer="false"
          table-class="border-0"
          disable-auto-left-padding>
          <template #[`item.status`]="{ item }">
            <BaseChip
              :append-icon="statusIcon(item.status)"
              :label="item.status"
              :text-class="statusTextClass(item.status)"
              :wrapper-class="statusWrapperClass(item.status)" />
          </template>
        </BaseTable>
        <div
          v-else
          key="auction"
          class="rounded-xl border border-surface-200 bg-white p-5">
          <div class="flex items-start justify-between">
            <div class="text-sm font-bold text-surface-500">
              ขายต่อ/ประมูล
            </div>
            <Icon
              class="size-5 text-surface-700"
              icon="mdi:dots-vertical" />
          </div>
          <div class="mt-4 max-w-md">
            <DisplayList :items="auctionItems" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { IColumn } from '@/models/Table.model'
import BaseTable from '@/components/table/BaseTable.vue'
import BaseChip from '@/components/chip/BaseChip.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import type { IAssetHistoryItem } from '@/models/asset/AssetDetail.model'

interface IProps {
  items: IAssetHistoryItem[]
}

defineProps<IProps>()

const columns = ref<IColumn<IAssetHistoryItem>[]>([
  { field: 'date', header: 'วันที่', align: 'left', style: { minWidth: '100px' } },
  { field: 'origin', header: 'ต้นทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'destination', header: 'ปลายทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'sentBy', header: 'ย้ายโดย', align: 'left', style: { minWidth: '200px' } },
  { field: 'receivedBy', header: 'รับโดย', align: 'left', style: { minWidth: '160px' } },
  { field: 'status', header: 'สถานะ', align: 'right', style: { minWidth: '110px' } }
])

const activeTab = ref<'history' | 'auction'>('history')
const auctionItems = ref<IDisplayList[]>([
  { key: 'appraisalValue', label: 'ยอดประเมินหลักทรัพย์', value: '120,000 บาท' },
  { key: 'auctionValue', label: 'ยอดที่ขาย/ประมูลได้', value: '200,000 บาท' },
  { key: 'diff', label: 'ส่วนต่าง', value: '80,000 บาท' },
  { key: 'auctionDate', label: 'วันที่ขาย/ประมูล', value: '12/3/68' }
])

function setTab (tab: 'history' | 'auction'): void {
  activeTab.value = tab
}

function statusWrapperClass (status: string): string {
  if (status === 'รอรับ') return 'border-[#FFF6DB] bg-[#FFF6DB] text-[#FFC000]'
  return 'border-[#CFFFE3] bg-[#CFFFE3] text-[#219653]'
}

function statusTextClass (status: string): string {
  if (status === 'รอรับ') return 'text-[#FFC000]'
  return 'text-[#219653]'
}

function statusIcon (status: string): string {
  if (status === 'รอรับ') return 'solar:clock-circle-linear'
  return 'solar:check-circle-linear'
}
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 240ms ease, transform 240ms ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
