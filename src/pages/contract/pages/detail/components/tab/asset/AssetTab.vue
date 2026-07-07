<template>
  <div class="grid gap-2.5">
    <AssetSection
      v-if="assets.length"
      :active-asset="activeAsset"
      :active-index="activeIndex"
      :asset-category="assetCategory"
      :pre-assets="assets"
      @active="onActiveAsset($event)" />
    <Empty v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractAssetList } from '@/models/response/contract/ContractRes.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import Empty from '@/components/display/Empty.vue'
import { getAssetCategory, type TAssetCategory } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import AssetSection from '@/pages/contract/pages/pre-contract-detail/components/AssetSection.vue'

defineOptions({
  inheritAttrs: false
})
const route = useRoute()

const ContractService: IContractProvider = new ContractProvider()

const contractId = computed((): string | string[] => route.params.id)
const assets = ref<IContractAssetList[]>([])

const activeIndex = ref<number | undefined>(0)
const activeAsset = computed((): IContractAssetList | null => {
  if (activeIndex.value === undefined || !assets.value?.[activeIndex.value]) return null
  return assets.value?.[activeIndex.value]
})

const assetCategory = computed((): TAssetCategory => getAssetCategory(assets.value ?? []))

async function useFetch (): Promise<void> {
  const res = await ContractService.getContractAssets(contractId.value)
  assets.value = res.data
}


function onActiveAsset (index?: number): void {
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
