<template>
  <Teleport to="body">
    <ModalAssetDetail
      v-if="modalAsset"
      v-model="modalVisible"
      :asset="modalAsset"
      :contract-id="contractId"
      @saved="onAssetSaved()" />
  </Teleport>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <PreContractDetailMenuAction @edit="onEdit()" />
    </BaseTop>
    <BasePage>
      <div
        v-if="contract"
        class="flex flex-col gap-5 pb-10">
        <PreContractInformation :data="contract" />
        <AssetSection
          v-if="contract.assets.length"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          :assets="contract.assets"
          @active="onActiveAsset($event)"
          @open="openModal($event)" />
        <PreContractAction
          v-model:request-reappraisal="form"
          :disabled="!filledAllRequired"
          @cancel="onCancel()"
          @confirm="onRequestPreContract()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetSection from '../components/AssetSection.vue'
import ModalAssetDetail from '../components/ModalAssetDetail.vue'
import PreContractAction from '../components/PreContractAction.vue'
import PreContractDetailMenuAction from '../components/PreContractDetailMenuAction.vue'
import PreContractInformation from '../components/PreContractInformation.vue'
import { useInitDetail } from '../composables/useInitDetail'
import { useRequestReappraisal } from '../composables/useRequestReappraisal'

const {
  contract,
  activeAsset,
  activeIndex,
  assetCategory,
  filledAllRequired,
  modalAsset,
  modalVisible,
  contractId,
  onActiveAsset,
  openModal,
  onAssetSaved,
  onEdit,
  onCancel,
  useFetch,
  fetch
} = useInitDetail()
const { form, onRequestPreContract } = useRequestReappraisal(useFetch)

onMounted((): void => {
  fetch()
})
</script>
