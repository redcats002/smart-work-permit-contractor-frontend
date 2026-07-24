<template>
  <div
    v-if="asset"
    class="grid grid-cols-1 md:grid-cols-2 gap-4 relative rounded-xl border border-surface-200 bg-white p-5">
    <div>
      <BaseGalleria
        v-if="asset.images?.length"
        :images="asset.images" />
      <AssetEmpty v-else />
    </div>
    <div>
      <div class="mb-4">
        <p class="font-bold text-xl text-surface-800 mb-2">
          {{ formatTitle(asset.type) }}
        </p>
        <DisplayList
          :items="assetStatusItems"
          class="mb-2"
          label-class="text-font-gray!">
          <template #[`value.status`]>
            <ChipAssetStatus
              :value="asset.status" />
          </template>
        </DisplayList>
        <DisplayList
          :items="items"
          class="mb-2"
          label-class="text-font-gray!" />
        <LabelField
          v-if="asset?.files?.length"
          label="เอกสารหลักทรัพย์">
          <FileAttachment
            :files="asset?.files" />
        </LabelField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IContractAssetDetail } from '@/models/response/contract-asset/ContractAssetRes.model.ts'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import BaseGalleria from '@/components/base/BaseGalleria.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import LabelField from '@/components/input/LabelField.vue'
import AssetEmpty from '@/pages/contract/pages/pre-contract-detail/components/make-contract/AssetEmpty.vue'
import { type IAssetDisplayItemsInput, useAssetDisplayItems } from '@/pages/contract/pages/pre-contract-detail/composables/useAssetDisplayItems'
import ChipAssetStatus from '@/pages/stock/pages/list/components/asset/ChipAssetStatus.vue'

interface IProps {
  asset?: IContractAssetDetail | null
}

const props = withDefaults(defineProps<IProps>(), {
  asset: null
})

const items = useAssetDisplayItems(computed((): IAssetDisplayItemsInput | null => props.asset && {
  type: props.asset.type,
  detail: props.asset.detail,
  locationName: props.asset.location?.name,
  realEstateForm: props.asset.realEstateForm,
  vehicleForm: props.asset.vehicleForm,
  apartmentForm: props.asset.apartmentForm
}))

const assetStatusItems = computed((): IDisplayList[] => {
  return [
    { key: 'status', label: 'สถานะหลักทรัพย์', value: props.asset?.status ?? '-' }
  ]
})

</script>

<style scoped>

</style>
