<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="rounded-xl border border-surface-200 bg-white p-5 relative">
      <button
        v-if="isWaiting"
        class="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full hover:bg-surface-50"
        @click="openStatusModal()">
        <Icon
          class="size-5 text-surface-700"
          icon="mdi:dots-vertical" />
      </button>
      <DisplayList :items="assetItems">
        <template #[`value.status`]>
          <BaseChip
            :append-icon="statusIcon(assetInfo.status)"
            :label="statusLabel(assetInfo.status)"
            :text-class="statusTextClass(assetInfo.status)"
            :wrapper-class="statusWrapperClass(assetInfo.status)" />
        </template>
      </DisplayList>
    </div>

    <div class="rounded-xl border border-surface-200 bg-white p-5">
      <DisplayList :items="contractItems">
        <template #[`value.contractStatus`]>
          <BaseChip
            :append-icon="contractStatusIcon"
            :label="contractStatusLabel"
            :text-class="contractStatusTextClass"
            :wrapper-class="contractStatusWrapperClass" />
        </template>
        <template #[`value.contractNo`]>
          <span class="underline text-surface-700">
            {{ contractInfo.contractNo }}
          </span>
        </template>
      </DisplayList>
    </div>
  </div>

  <BaseModal
    v-model="showStatusModal"
    class="md:w-140!"
    header-align="left"
    label="สถานะหลักทรัพย์">
    <template #default>
      <SelectInput
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="รอขาย" />
    </template>
    <template #footer>
      <div class="flex items-center gap-4">
        <Button
          class="bg-[#C00000]! hover:bg-[#a30000]! text-white! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
          @click="confirmStatusChange()">
          <span class="text-sm font-medium">ยืนยัน</span>
        </Button>
        <Button
          class="bg-white! text-[#C00000]! border-[#C00000]! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
          @click="closeStatusModal()">
          <span class="text-sm font-medium">ยกเลิก</span>
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseChip from '@/components/chip/BaseChip.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import type { IAssetDetailInfo, IContractDetailInfo } from '@/models/asset/AssetDetail.model'

interface IProps {
  assetInfo: IAssetDetailInfo
  contractInfo: IContractDetailInfo
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  'update:asset-status': [status: string]
}>()

const assetItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะหลักทรัพย์', value: statusLabel(props.assetInfo.status) },
  { key: 'assetNo', label: 'เลขที่หลักทรัพย์', value: props.assetInfo.assetNo },
  { key: 'assetCategory', label: 'หมวดหมู่หลักทรัพย์', value: props.assetInfo.assetCategory },
  { key: 'assetGroup', label: 'หมวดหมู่หลักทรัพย์', value: props.assetInfo.assetGroup },
  { key: 'appraisalValue', label: 'ยอดประเมินหลักทรัพย์', value: props.assetInfo.appraisalValue },
  { key: 'address', label: 'ที่อยู่หลักทรัพย์', value: props.assetInfo.address },
  { key: 'storageCode', label: 'จุดจัดเก็บเอกสารหลักทรัพย์', value: props.assetInfo.storageCode }
])

const contractItems = computed((): IDisplayList[] => [
  { key: 'contractStatus', label: 'สถานะสัญญา', value: props.contractInfo.contractStatus },
  { key: 'contractNo', label: 'เลขที่สัญญา', value: props.contractInfo.contractNo },
  { key: 'contractDate', label: 'วันที่ทำสัญญา', value: props.contractInfo.contractDate },
  { key: 'employee', label: 'พนักงาน', value: props.contractInfo.employee }
])

const isWaiting = computed((): boolean => getStatusKey(props.assetInfo.status) === 'WAITING')
const showStatusModal = ref<boolean>(false)
const selectedStatus = ref<string>(props.assetInfo.status)

const statusOptions = [
  { label: 'รอขาย', value: 'WAITING' },
  { label: 'ใช้งานอยู่', value: 'IN_USE' },
  { label: 'ขายแล้ว', value: 'SOLD' }
]

function openStatusModal (): void {
  selectedStatus.value = props.assetInfo.status
  showStatusModal.value = true
}

function closeStatusModal (): void {
  showStatusModal.value = false
}

function confirmStatusChange (): void {
  if (selectedStatus.value !== props.assetInfo.status) {
    emit('update:asset-status', selectedStatus.value)
  }
  closeStatusModal()
}

type TStatusKey = 'WAITING' | 'IN_USE' | 'SOLD'

function getStatusKey (status: string): TStatusKey {
  if (status === 'WAITING') return 'WAITING'
  if (status === 'SOLD') return 'SOLD'
  return 'IN_USE'
}

const statusStyles: Record<TStatusKey, { icon: string, wrapper: string, text: string }> = {
  WAITING: {
    icon: 'solar:clock-circle-linear',
    wrapper: 'border-[#FFF6DB] bg-[#FFF6DB] text-[#FFC000] font-[Sarabun]',
    text: 'text-[#FFC000]'
  },
  IN_USE: {
    icon: 'mdi:trending-up',
    wrapper: 'border-[#DBEAFF] bg-[#DBEAFF] text-[#2F80ED] font-[Sarabun]',
    text: 'text-[#2F80ED]'
  },
  SOLD: {
    icon: 'mdi:tag-outline',
    wrapper: 'border-[#BDBDBD] bg-[#BDBDBD] text-[#333333] font-[Sarabun]',
    text: 'text-[#333333]'
  }
}

const statusLabels: Record<TStatusKey, string> = {
  WAITING: 'รอขาย',
  IN_USE: 'ใช้งานอยู่',
  SOLD: 'ขายแล้ว'
}

function statusLabel (status: string): string {
  return statusLabels[getStatusKey(status)]
}

function statusIcon (status: string): string {
  return statusStyles[getStatusKey(status)].icon
}

function statusWrapperClass (status: string): string {
  return statusStyles[getStatusKey(status)].wrapper
}

function statusTextClass (status: string): string {
  return statusStyles[getStatusKey(status)].text
}

const isContractCancelled = computed((): boolean => props.contractInfo.contractStatus.includes('ยกเลิก'))

const contractStatusWrapperClass = computed((): string => {
  if (isContractCancelled.value) return 'border-[#FFDBDB] bg-[#FFDBDB] text-[#EB5757] font-[Sarabun]'
  return 'border-[#DBEAFF] bg-[#DBEAFF] text-[#2F80ED]'
})

const contractStatusTextClass = computed((): string => {
  if (isContractCancelled.value) return 'text-[#EB5757]'
  return 'text-[#2F80ED]'
})

const contractStatusIcon = computed((): string => {
  if (isContractCancelled.value) return 'mdi:close'
  return 'mdi:trending-up'
})

const contractStatusLabel = computed((): string => {
  if (isContractCancelled.value) return 'ยกเลิก'
  return 'ใช้งานอยู่'
})

</script>

<style scoped></style>
