<template>
  <section id="contract-refinance-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="contract" />
        <AssetSection
          v-if="assets.length"
          v-model:pre-assets="assets"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          @active="onActiveAsset($event)" />
        <InstallmentSection
          ref="installmentSectionRef"
          v-model="formMakeContract"
          :contract="contract"
          is-refinance />
        <ContractRefinanceAction
          v-if="contract?.status"
          :disabled="invalid"
          :status="contract?.status"
          @cancel="onCancel()"
          @make-contract="onConfirmMakeContract()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractAssetList } from '@/models/response/contract/ContractRes.model'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ContractRefinanceAction from '../components/ContractRefinanceAction.vue'
import type { TAssetCategory } from '../../create/schema/pre-contract.schema'
import { getAssetCategory } from '../../create/schema/pre-contract.schema'
import InformationDetail from '../../detail/components/InformationDetail.vue'
import { useInitDetail as useInitDetailContract } from '../../detail/composables/useInitDetail.ts'
import AssetSection from '../../pre-contract-detail/components/AssetSection.vue'
import InstallmentSection from '../../pre-contract-detail/components/InstallmentSection.vue'
import { useMakeContract } from '../composables/useMakeContract.ts'

const route = useRoute()
const router = useRouter()

const ContractService: IContractProvider = new ContractProvider()
const { formMakeContract, onConfirmMakeContract, invalid } = useMakeContract(useFetch)

const contract = useInitDetailContract()
const contractId = computed((): number => Number(route?.params?.id as string ?? ''))

const assets = ref<IContractAssetList[]>([])
const activeIndex = ref<number>(0)
const activeAsset = computed((): IContractAssetList | undefined => assets.value[activeIndex.value])
const assetCategory = computed((): TAssetCategory => getAssetCategory(assets.value))

function onActiveAsset (index?: number): void {
  activeIndex.value = index ?? 0
}

async function useFetch (): Promise<void> {
  const [{ data: contractData }, { data: assetData }] = await Promise.all([
    ContractService.getContractFindOne(contractId.value),
    ContractService.getContractAssets(contractId.value)
  ])
  contract.value = useInitDetailContract(contractData).value
  assets.value = assetData ?? []
}

function fetch (): void {
  handleLoading(useFetch)
}

function onCancel (): void {
  router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
