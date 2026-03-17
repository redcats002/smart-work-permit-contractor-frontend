<template>
  <Teleport to="body">
    <ModalAssetDetail
      v-if="modalAsset"
      v-model="modalVisible"
      v-model:form="formPreAsset"
      :asset="modalAsset"
      :contract-id="contractId"
      @saved="onUpdatePreAsset(modalAsset.id)" />
  </Teleport>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <PreContractDetailMenuAction
        v-if="false"
        :status="contract?.status"
        @edit="onEdit()" />
    </BaseTop>
    <BasePage>
      <div class="flex flex-col gap-5 pb-10">
        <MortgageForm
          v-if="contract?.status === 'PENDING_MORTGAGE' && isMortgageFormVisible"
          ref="mortgageFormRef"
          v-model="formMortgage"
          :primary-customer="primaryCustomer"
          @confirmed="onConfirmMortgage()" />
        <template v-else>
          <PreContractInformation
            v-if="contract"
            :data="contract" />
        </template>
        <AssetSection
          v-if="contract?.preAssets.length"
          v-model:pre-assets="formMakeContract.preAssets"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          :assets="contract.preAssets"
          :status="contract.status"
          @active="onActiveAsset($event)"
          @open="openModal($event)" />
        <AppraisalSection
          v-if="contract?.status === 'UNDER_EVALUATION'"
          v-model:appraisal-price="formAppraisalPrice"
          :appraisals="contract?.evaluateGroups"
          @submit="onAppraisalPrice()" />
        <InstallmentSection
          v-if="contract?.status === 'PENDING_CONTRACT'"
          v-model="formMakeContract"
          :contract="contract" />
        <PreContractAction
          v-if="contract?.status"
          v-model:confirm-appraisal="formConfirmAppraisal"
          v-model:request-appraisal="formRequestAppraisal"
          v-model:request-reappraisal="formRequestReappraisal"
          :disabled="!filledAllRequired"
          :evaluate-groups="contract.evaluateGroups"
          :is-mortgage-form-visible="isMortgageFormVisible"
          :status="contract?.status"
          @cancel="onCancel()"
          @confirm-appraisal="onConfirmAppraisal()"
          @confirm-mortgage="onTriggerConfirmMortgage()"
          @make-contract="onConfirmMakeContract()"
          @request-appraisal="onRequestAppraisal()"
          @request-reappraisal="onRequestReappraisal()"
          @submit-mortgage="onSubmitMortgage()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
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
import { usePreAsset } from '../composables/usePreAsset'

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
  onEdit,
  onCancel,
  useFetch,
  fetch
} = useInitDetail()
const { formPreAsset, onUpdatePreAsset } = usePreAsset(useFetch)
const {
  formRequestReappraisal,
  formRequestAppraisal,
  formAppraisalPrice,
  formConfirmAppraisal,
  onAppraisalPrice,
  onRequestReappraisal,
  onRequestAppraisal,
  onConfirmAppraisal
} = useAppraisal(useFetch)
const { formMortgage, isMortgageFormVisible, onConfirmMortgage, onSubmitMortgage } = useMortgage(useFetch)
const { formMakeContract, onConfirmMakeContract } = useMakeContract(useFetch)
const mortgageFormRef = useTemplateRef<{ submit: () => void }>('mortgageFormRef')

const primaryCustomer = computed((): ICustomerById | null => {
  if (!contract.value?.customer) return null
  return contract.value?.customer
})

function onTriggerConfirmMortgage (): void {
  mortgageFormRef.value?.submit()
}

onMounted((): void => {
  fetch()
})
</script>
