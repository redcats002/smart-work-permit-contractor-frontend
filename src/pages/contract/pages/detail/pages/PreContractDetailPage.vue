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
      <PreContractDetailMenuAction
        :status="contract?.status"
        @edit="onEdit()" />
    </BaseTop>
    <BasePage>
      <div
        v-if="contract && contract?.status"
        class="flex flex-col gap-5 pb-10">
        <MortgageForm
          v-if="contract.status==='WAIT_MORTGAGE' && isMortgageFormVisible"
          ref="mortgageFormRef"
          v-model="formMortgage"
          :primary-customer-name="primaryCustomerName"
          @confirmed="onConfirmMortgage()" />
        <PreContractInformation
          v-else
          :data="contract" />
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
        <InstallmentSection
          v-if="contract.status === 'WAIT_CONTRACT'"
          v-model="formMakeContract" />
        <PreContractAction
          v-model:request-reappraisal="formRequestReappraisal"
          :disabled="!filledAllRequired"
          :is-mortgage-form-visible="isMortgageFormVisible"
          :status="contract.status"
          @cancel="onCancel()"
          @confirm-appraisal="onConfirmAppraisal()"
          @confirm-mortgage="onTriggerConfirmMortgage()"
          @make-contract="onConfirmMakeContract()"
          @request-reappraisal="onRequestReappraisal()"
          @submit-mortgage="onSubmitMortgage()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue'
import { formatter } from '@/utils/Formatter'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AppraisalSection from '../components/AppraisalSection.vue'
import AssetSection from '../components/AssetSection.vue'
import InstallmentSection from '../components/InstallmentSection.vue'
import ModalAssetDetail from '../components/ModalAssetDetail.vue'
import MortgageForm from '../components/MortgageForm.vue'
import PreContractAction from '../components/PreContractAction.vue'
import PreContractDetailMenuAction from '../components/PreContractDetailMenuAction.vue'
import PreContractInformation from '../components/PreContractInformation.vue'
import { useAppraisal } from '../composables/useAppraisal'
import { useInitDetail } from '../composables/useInitDetail'
import { useMakeContract } from '../composables/useMakeContract'
import { useMortgage } from '../composables/useMortgage'

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
const { formMortgage, isMortgageFormVisible, onConfirmMortgage, onSubmitMortgage } = useMortgage(useFetch)
const { onConfirmMakeContract, formMakeContract } = useMakeContract(useFetch)
const mortgageFormRef = useTemplateRef<{ submit: () => void }>('mortgageFormRef')

const primaryCustomerName = computed((): string | null => {
  if (!contract.value?.customer) return null
  return formatter.fullName(contract.value?.customer)
})

function onTriggerConfirmMortgage (): void {
  mortgageFormRef.value?.submit()
}

onMounted((): void => {
  fetch()
})
</script>
