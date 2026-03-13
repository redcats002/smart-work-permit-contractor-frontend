<template>
  <BaseContainer>
    <div
      :class="{
        'grid-cols-[200px_1fr]': isLand,
        'grid-cols-1': !isLand
      }"
      class="grid gap-6 min-h-80">
      <div
        v-if="isLand"
        class="flex flex-col border-r border-surface-200 pr-4 gap-1">
        <Button
          v-for="(col, i) in assets"
          :key="col.id ?? i"
          :class="activeIndex === i ? 'border-primary! font-bold text-font-gray!' : 'border-transparent text-surface-500!'"
          class="border-b-2! border-l-0 border-t-0 border-r-0 text-sm text-left py-2 hover:text-primary transition-colors rounded-b-none!"
          type="button"
          text
          @click="onActiveAsset(i)">
          หลักทรัพย์ที่{{ i + 1 }}
        </Button>
      </div>
      <div
        v-if="activeAsset"
        class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div
            v-if="activeAsset.images?.length"
            class="grid gap-3 mt-2">
            <BaseGalleria :images="activeAsset.images" />
          </div>
          <div
            v-else
            class="flex items-center justify-center h-48 bg-surface-50 rounded-md border border-surface-200">
            <p class="text-xl text-surface-400">
              ไม่มีข้อมูล
            </p>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <p class="font-bold text-xl text-surface-800 mb-2">
              {{ formatTitle(activeAsset.assetType) }}
            </p>
            <DisplayList :items="items" />
            <AssetWarehouseForm v-if="status==='WAIT_CONTRACT'" />
          </div>
          <Button
            v-if="isShowEdit"
            class="flex items-center gap-1.5 border border-surface-700! rounded-sm px-4 h-9 text-sm text-surface-700! hover:bg-surface-50! transition-colors w-fit"
            type="button"
            outlined
            @click="openModal(activeAsset)">
            ใส่รายละเอียดสินทรัพย์
          </Button>
        </div>
      </div>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IAssetDetailInfo } from '@/models/response/pre-contract/PreContractRes.model'
import { formatTitle } from '@/enums/modules/contract/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BaseGalleria from '@/components/base/BaseGalleria.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import type { TAssetCategory } from '../../create/pages/PreContractCreatePage.vue'
import AssetWarehouseForm from './AssetWarehouseForm.vue'

interface IProps {
  activeIndex?: number
  activeAsset?: IAssetDetailInfo | null
  assets?: IAssetDetailInfo[]
  assetCategory?: TAssetCategory
  status?: TPreContractStatus
}

interface IEmits {
  active: [index: number]
  open: [assets: IAssetDetailInfo]
}

const props = withDefaults(defineProps<IProps>(), {
  assets: (): IAssetDetailInfo[] => [],
  activeAsset: undefined,
  activeIndex: undefined,
  assetCategory: null,
  status: undefined
})

const emits = defineEmits<IEmits>()

const isShowEdit = computed((): boolean => {
  const editableStatus: TPreContractStatus[] = ['DRAFT', 'PENDING']
  return props.activeAsset !== undefined && props.status !== undefined && editableStatus.includes(props.status)
})

const items = computed((): IDisplayList[] => {
  if (isLand.value) {
    const fullAddress = formatter.fullAddress({
      address: props.activeAsset?.address || '',
      subDistrict: props.activeAsset?.subDistrict || '',
      district: props.activeAsset?.district || '',
      province: props.activeAsset?.province || '',
      postCode: props.activeAsset?.postCode || '',
      urlGoogleMap: props.activeAsset?.urlGoogleMap || ''
    })
    return [
      { label: 'เลขที่ดิน', value: props.activeAsset?.landNumber || '-', key: 'landNumber', hidden: !props.activeAsset?.landNumber },
      { label: 'เลขหน้าสำรวจ', value: props.activeAsset?.surveyPageNumber || '-', key: 'surveyPageNumber', hidden: !props.activeAsset?.surveyPageNumber },
      { label: 'ที่อยู่หลักทรัพย์', value: fullAddress, key: 'address', extUrl: props.activeAsset?.urlGoogleMap || '', hidden: !fullAddress },
      { label: 'ระวางรูปถ่ายทางอากาศ', value: `หมายเลข ${props.activeAsset?.aerialPhotoNumber || '-'} แผ่นที่ ${props.activeAsset?.aerialPhotoSheet || '-'}`, key: 'aerialPhoto', hidden: !props.activeAsset?.aerialPhotoNumber && !props.activeAsset?.aerialPhotoSheet }
    ]
  }
  return [
    { label: 'รายละเอียดหลักทรัพย์', value: props.activeAsset?.detail || '-', key: 'detail', hidden: !props.activeAsset?.detail },
    { label: 'เลขทะเบียนรถ', value: props.activeAsset?.licensePlate || '-', key: 'licensePlate', hidden: !props.activeAsset?.licensePlate },
    { label: 'ปีที่ผลิต', value: props.activeAsset?.yearManufactured || '-', key: 'manufactureYear', hidden: !props.activeAsset?.yearManufactured },
    { label: 'ปีที่จดทะเบียน', value: props.activeAsset?.yearRegistered || '-', key: 'registrationYear', hidden: !props.activeAsset?.yearRegistered },
    { label: 'หมายเลขตัวถัง', value: props.activeAsset?.chassisNumber || '-', key: 'chassisNumber', hidden: !props.activeAsset?.chassisNumber },
    { label: 'เลขไมล์ (กม.)', value: props.activeAsset?.mileage || '-', key: 'mileage', hidden: !props.activeAsset?.mileage }
  ]
})
const isLand = computed((): boolean => props.assetCategory === 'LAND')

function onActiveAsset (index: number): void {
  emits('active', index)
}

function openModal (asset: IAssetDetailInfo): void {
  emits('open', asset)
}


</script>

<style scoped></style>
