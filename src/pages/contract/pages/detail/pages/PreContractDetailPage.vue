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
        v-if="contract && contract?.status"
        class="flex flex-col gap-5 pb-10">
        <PreContractInformation :data="contract" />
        <AssetSection
          v-if="contract.assets.length"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          :assets="contract.assets"
          :status="contract.status"
          @active="onActiveAsset($event)"
          @open="openModal($event)" />
        <AppraisalSection
          v-if="contract?.status === 'IN_ASSESSMENT'"
          v-model:appraisal-price="formAppraisalPrice"
          :appraisals="contract?.appraisals"
          @submit="onAppraisalPrice()" />
        <PreContractAction
          v-model:request-reappraisal="formRequestReappraisal"
          :disabled="!filledAllRequired"
          :status="contract.status"
          @cancel="onCancel()"
          @confirm-appraisal="onConfirmAppraisal()"
          @request-reappraisal="onRequestReappraisal()" />
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
import AppraisalSection from '../components/AppraisalSection.vue'
import AssetSection from '../components/AssetSection.vue'
import ModalAssetDetail from '../components/ModalAssetDetail.vue'
import PreContractAction from '../components/PreContractAction.vue'
import PreContractDetailMenuAction from '../components/PreContractDetailMenuAction.vue'
import PreContractInformation from '../components/PreContractInformation.vue'
import { useAppraisal } from '../composables/useAppraisal'
import { useInitDetail } from '../composables/useInitDetail'

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
const { formRequestReappraisal, formAppraisalPrice, onAppraisalPrice, onRequestReappraisal, onConfirmAppraisal } = useAppraisal(useFetch)

onMounted((): void => {
  fetch()
})
</script>
