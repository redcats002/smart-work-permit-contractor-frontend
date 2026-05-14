<template>
  <Card>
    <template #content>
      <div class="flex justify-end">
        <div class="w-fit">
          <BaseActionMenu :items="actionMenuItems" />
        </div>
      </div>
      <DisplayList :items="auctionItems" />
    </template>
  </Card>

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
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'

interface IProps {
  loanAmount: number
  salePrice: number | null
  saleDate: string | null
  status: TAssetStatus
}

interface IEmits {
  sell: [salePrice: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

defineOptions({ inheritAttrs: false })

const dayjs = useDayjs()

const showSellModal = ref<boolean>(false)
const sellPriceInput = ref<string>('')

const auctionItems = computed((): IDisplayList[] => {
  const diff = props.loanAmount - (props.salePrice ?? 0)
  return [
    { key: 'appraisalValue', label: 'ยอดประเมินหลักทรัพย์', value: `${formatter.numberFormat(props.loanAmount)} บาท` },
    { key: 'auctionValue', label: 'ยอดที่ขาย/ประมูลได้', value: props.salePrice != null ? `${formatter.numberFormat(props.salePrice)} บาท` : '-' },
    { key: 'diff', label: 'ส่วนต่าง', value: props.salePrice != null ? `${formatter.numberFormat(diff)} บาท` : '-' },
    { key: 'auctionDate', label: 'วันที่ขาย/ประมูล', value: props.saleDate != null ? dayjs.formatDateTime(props.saleDate) : '-' }
  ]
})

const actionMenuItems = computed((): IMenuItemAction[] => [
  {
    key: 'sell',
    label: 'แก้ไขข้อมูล',
    type: 'TEXT',
    disabled: props.status !== 'PENDING_SALE',
    action: (): void => { openSellModal() }
  }
])

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
</script>
