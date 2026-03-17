<template>
  <div class="grid gap-2.5">
    <AssetSection
      v-if="contract?.preAssets.length"
      :active-asset="activeAsset"
      :active-index="activeIndex"
      :asset-category="assetCategory"
      :assets="contract.preAssets"
      :status="contract?.status"
      @active="onActiveAsset($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { TAssetCategory } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import AssetSection from '@/pages/contract/pages/pre-contract-detail/components/AssetSection.vue'

const route = useRoute()

const PreContractService: IPreContractProvider = new PreContractProvider()

const contractId = computed((): string | string[] => route.params.id)
const contract = ref<IPreContractById | null>(null)

const activeIndex = ref<number>(0)
const activeAsset = computed((): IPreAssetList | null => {
  if (!contract.value?.preAssets?.[activeIndex.value]) return null
  return contract.value?.preAssets?.[activeIndex.value]
})

const assetCategory = computed((): TAssetCategory => {
  if (!contract.value?.preAssets.length) return null
  for (const e of contract.value.preAssets) {
    if (isVehicleAsset(e.type)) return 'VEHICLE'
    if (isLandAsset(e.type)) return 'LAND'
  }
  return null
})

async function useFetch (): Promise<void> {
  const res = await PreContractService.getContractFindOne(contractId.value)
  contract.value = res.data
}


function onActiveAsset (index: number): void {
  activeIndex.value = index
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
