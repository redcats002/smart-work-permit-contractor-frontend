<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="rounded-xl border border-surface-200 bg-white p-5 relative">
      <button
        v-if="isPendingSale"
        class="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full hover:bg-surface-50"
        @click="openStatusModal()">
        <Icon
          class="size-5 text-surface-700"
          icon="mdi:dots-vertical" />
      </button>
      <DisplayList :items="assetItems">
        <template #[`value.status`]>
          <BaseChip
            :append-icon="statusIcon(props.detail.status)"
            :label="statusLabel(props.detail.status)"
            :wrapper-class="statusWrapperClass(props.detail.status)" />
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
            {{ props.detail.contract.idNo }}
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
      <AssetStatusSelection
        v-model="selectedStatus"
        placeholder="เลือกสถานะ" />
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
import type { IContractAssetDetail } from '@/models/response/contract-asset/ContractAssetRes.model'
import { AssetStatusEnum, formatTitle, getIcon, getStatusClass } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import { formatTitle as formatTypeTitle } from '@/enums/modules/asset/AssetType.enum'
import BaseChip from '@/components/chip/BaseChip.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Icon } from '@iconify/vue'
import AssetStatusSelection from '@/components/selection/modules/static/asset-status/AssetStatusSelection.vue'
import { formatter } from '@/utils/Formatter'

interface IProps {
  detail: IContractAssetDetail
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  'update:asset-status': [status: TAssetStatus]
}>()

const assetItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะหลักทรัพย์', value: statusLabel(props.detail.status) },
  { key: 'idNo', label: 'เลขที่หลักทรัพย์', value: props.detail.idNo },
  { key: 'type', label: 'ประเภทหลักทรัพย์', value: formatTypeTitle(props.detail.type) },
  { key: 'loanAmount', label: 'ยอดประเมินหลักทรัพย์', value: formatter.numberFormat(props.detail.contract.loanAmount) },
  { key: 'address', label: 'ที่อยู่หลักทรัพย์', value: props.detail.realEstateForm?.address ?? '-' },
  { key: 'location', label: 'จุดจัดเก็บเอกสารหลักทรัพย์', value: props.detail.location?.name ?? '-' }
])

const contractItems = computed((): IDisplayList[] => [
  { key: 'contractStatus', label: 'สถานะสัญญา', value: props.detail.contract.status },
  { key: 'contractNo', label: 'เลขที่สัญญา', value: props.detail.contract.idNo },
  { key: 'contractDate', label: 'วันที่ทำสัญญา', value: props.detail.contract.contractedAt },
  { key: 'employee', label: 'พนักงาน', value: props.detail.contract.sellMan.fullName }
])

const isPendingSale = computed((): boolean => props.detail.status === AssetStatusEnum.PENDING_SALE)
const showStatusModal = ref<boolean>(false)
const selectedStatus = ref<string>(props.detail.status)

function openStatusModal (): void {
  selectedStatus.value = props.detail.status
  showStatusModal.value = true
}

function closeStatusModal (): void {
  showStatusModal.value = false
}

function confirmStatusChange (): void {
  if (selectedStatus.value && selectedStatus.value !== props.detail.status) {
    emit('update:asset-status', selectedStatus.value as TAssetStatus)
  }
  closeStatusModal()
}

function statusLabel (status: TAssetStatus): string {
  return formatTitle(status)
}

function statusIcon (status: TAssetStatus): string {
  return getIcon(status)
}

function statusWrapperClass (status: TAssetStatus): string {
  return getStatusClass(status)
}

const isContractCancelled = computed((): boolean => props.detail.contract.status.includes('ยกเลิก'))

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
