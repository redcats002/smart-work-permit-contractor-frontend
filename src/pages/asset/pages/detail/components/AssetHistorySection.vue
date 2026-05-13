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
          table-class="border-0"
          disable-auto-left-padding
          hide-pagination>
          <template #[`item.status`]="{ item }">
            <BaseChip
              :append-icon="historyStatusIcon(item.status)"
              :label="item.status"
              :text-class="historyStatusTextClass(item.status)"
              :wrapper-class="historyStatusWrapperClass(item.status)" />
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
            <BaseActionMenu :items="actionMenuItems" />
          </div>
          <div class="mt-4 max-w-md">
            <DisplayList :items="auctionItems" />
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <BaseModal
    v-model="showSellModal"
    class="md:w-140!"
    header-align="left"
    label="ขายหลักทรัพย์">
    <template #default>
      <div class="space-y-4">
        <div>
          <div class="text-sm text-surface-500 mb-1">
            ยอดประเมินหลักทรัพย์
          </div>
          <div class="text-base font-medium">
            {{ formatter.numberFormat(loanAmount) }} บาท
          </div>
        </div>
        <div>
          <LabelField label="ยอดที่ขาย/ประมูลได้">
            <InputText
              v-model="sellPriceInput"
              class="w-full"
              placeholder="0"
              type="number" />
          </LabelField>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center gap-4">
        <Button
          class="bg-[#C00000]! hover:bg-[#a30000]! text-white! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
          @click="confirmSell()">
          <span class="text-sm font-medium">ยืนยัน</span>
        </Button>
        <Button
          class="bg-white! text-[#C00000]! border-[#C00000]! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
          @click="closeSellModal()">
          <span class="text-sm font-medium">ยกเลิก</span>
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IColumn } from '@/models/Table.model'

interface IAssetHistoryItem {
  id: number
  date: string
  origin: string
  destination: string
  sentBy: string
  receivedBy: string
  status: string
}
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseChip from '@/components/chip/BaseChip.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import LabelField from '@/components/input/LabelField.vue'
import { formatter } from '@/utils/Formatter'

interface IProps {
  items: IAssetHistoryItem[]
  loanAmount: number
  salePrice: number | null
  saleDate: string | null
}

interface IEmits {
  sell: [salePrice: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const columns = ref<IColumn<IAssetHistoryItem>[]>([
  { field: 'date', header: 'วันที่', align: 'left', style: { minWidth: '100px' } },
  { field: 'origin', header: 'ต้นทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'destination', header: 'ปลายทาง', align: 'left', style: { minWidth: '220px' } },
  { field: 'sentBy', header: 'ย้ายโดย', align: 'left', style: { minWidth: '200px' } },
  { field: 'receivedBy', header: 'รับโดย', align: 'left', style: { minWidth: '160px' } },
  { field: 'status', header: 'สถานะ', align: 'right', style: { minWidth: '110px' } }
])

const activeTab = ref<'history' | 'auction'>('history')
const showSellModal = ref<boolean>(false)
const sellPriceInput = ref<string>('')

const auctionItems = computed((): IDisplayList[] => {
  const diff = props.loanAmount - (props.salePrice ?? 0)
  return [
    { key: 'appraisalValue', label: 'ยอดประเมินหลักทรัพย์', value: `${formatter.numberFormat(props.loanAmount)} บาท` },
    { key: 'auctionValue', label: 'ยอดที่ขาย/ประมูลได้', value: props.salePrice != null ? `${formatter.numberFormat(props.salePrice)} บาท` : '-' },
    { key: 'diff', label: 'ส่วนต่าง', value: props.salePrice != null ? `${formatter.numberFormat(diff)} บาท` : '-' },
    { key: 'auctionDate', label: 'วันที่ขาย/ประมูล', value: props.saleDate ?? '-' }
  ]
})

const actionMenuItems = computed((): IMenuItemAction[] => [
  {
    key: 'sell',
    label: 'ขายหลักทรัพย์',
    type: 'TEXT',
    action: (): void => { openSellModal() }
  }
])

function setTab (tab: 'history' | 'auction'): void {
  activeTab.value = tab
}

function openSellModal (): void {
  sellPriceInput.value = props.salePrice != null ? String(props.salePrice) : ''
  showSellModal.value = true
}

function closeSellModal (): void {
  showSellModal.value = false
}

function confirmSell (): void {
  const price = Number(sellPriceInput.value)
  if (price > 0) {
    emits('sell', price)
  }
  closeSellModal()
}

function historyStatusWrapperClass (status: string): string {
  if (status === 'รอรับ') return 'border-[#FFF6DB] bg-[#FFF6DB] text-[#FFC000]'
  return 'border-[#CFFFE3] bg-[#CFFFE3] text-[#219653]'
}

function historyStatusTextClass (status: string): string {
  if (status === 'รอรับ') return 'text-[#FFC000]'
  return 'text-[#219653]'
}

function historyStatusIcon (status: string): string {
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
