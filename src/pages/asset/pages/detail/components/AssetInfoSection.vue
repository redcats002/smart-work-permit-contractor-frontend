<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="rounded-xl border border-surface-200 bg-white p-5 relative">
      <div
        v-if="isAbleToChangeStatus"
        class="flex justify-end">
        <BaseActionMenu :items="actionItems" />
      </div>
      <DisplayList :items="assetItems">
        <template #[`value.status`]>
          <ChipAssetStatus :value="detail.status" />
        </template>
      </DisplayList>
    </div>

    <div class="rounded-xl border border-surface-200 bg-white p-5">
      <DisplayList :items="contractItems">
        <template #[`value.contractStatus`]>
          <ChipContractStatus :value="detail.contract.status" />
        </template>
        <template #[`value.contractNo`]>
          <LinkText :to="{name:'ContractDetailPage', params: {id:detail.contract.id}}">
            {{ detail.contract.idNo }}
          </LinkText>
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
        :contract-status="detail.contract.status"
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
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractAssetDetail } from '@/models/response/contract-asset/ContractAssetRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import { formatTitle } from '@/enums/modules/asset/AssetStatus.enum'
import { formatTitle as formatTypeTitle } from '@/enums/modules/asset/AssetType.enum'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import LinkText from '@/components/button/LinkText.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import AssetStatusSelection from '@/components/selection/modules/static/asset-status/AssetStatusSelection.vue'
import ChipContractStatus from '@/pages/contract/pages/list/components/ChipContractStatus.vue'
import ChipAssetStatus from '@/pages/stock/pages/list/components/asset/ChipAssetStatus.vue'

interface IProps {
  detail: IContractAssetDetail
}
interface IEmits {
  'update:asset-status': [status: TAssetStatus]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const assetItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะหลักทรัพย์', value: formatTitle(props.detail.status) },
  { key: 'idNo', label: 'เลขที่หลักทรัพย์', value: props.detail.idNo },
  { key: 'type', label: 'ประเภทหลักทรัพย์', value: formatTypeTitle(props.detail.type) },
  { key: 'loanAmount', label: 'ยอดประเมินหลักทรัพย์', value: formatter.numberFormat(props.detail.contract.loanAmount) },
  { key: 'address', label: 'ที่อยู่หลักทรัพย์', value: props.detail.realEstateForm?.address ?? '-' },
  { key: 'location', label: 'จุดจัดเก็บเอกสารหลักทรัพย์', value: props.detail.location?.name ?? '-' }
])

const contractItems = computed((): IDisplayList[] => [
  { key: 'contractStatus', label: 'สถานะสัญญา', value: props.detail.contract.status },
  { key: 'contractNo', label: 'เลขที่สัญญา', value: props.detail.contract.idNo },
  { key: 'contractDate', label: 'วันที่ทำสัญญา', value: dayjs.formatDateTime(props.detail.contract?.contractedAt) },
  { key: 'sellMan', label: 'พนักงาน', value: formatter.fullName(props.detail.contract.sellMan) }
])

const actionItems = computed((): IMenuItemAction[] => {
  return [
    { key: 'status', label: 'สถานะหลักทรัพย์', action: openStatusModal, disabled: !isAbleToChangeStatus.value }
  ]
})

const isAbleToChangeStatus = computed((): boolean => {
  return props.detail.contract.status !== 'PENDING'
})
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
    emits('update:asset-status', selectedStatus.value as TAssetStatus)
  }
  closeStatusModal()
}


</script>

<style scoped></style>
