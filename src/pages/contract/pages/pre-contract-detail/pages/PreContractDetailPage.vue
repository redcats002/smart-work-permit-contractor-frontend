<template>
  <Teleport to="body">
    <ModalAssetDetail
      v-if="modalAsset"
      v-model="modalVisible"
      v-model:form="formPreAsset"
      v-model:form-key="formKeyPreAsset"
      :asset="modalAsset"
      :contract-id="contractId"
      @mount="mountPreAsset()"
      @open="onInitPreAsset($event)"
      @saved="onUpdatePreAsset(modalAsset.id)" />
  </Teleport>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <PreContractDetailMenuAction
        :status="contract?.status"
        @cancel="onCancel()"
        @edit="onEdit()"
        @print="onPrint()" />
    </BaseTop>
    <BasePage>
      <div class="flex flex-col gap-5 pb-10">
        <MortgageForm
          v-if="contract?.status === 'PENDING_MORTGAGE' && isMortgageFormVisible"
          ref="mortgageFormRef"
          v-model="formMortgage"
          :primary-customer="primaryCustomer"
          @confirmed="onConfirmMortgage()" />
        <PreContractInformation
          v-else
          :data="contract" />
        <AssetSection
          v-if="formMakeContract?.preAssets?.length"
          ref="assetSectionRef"
          v-model:pre-assets="formMakeContract.preAssets"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          :form-key="formKeyMakeAContract"
          :status="contract?.status"
          @active="onActiveAsset($event)"
          @open="openModal($event)" />
        <AppraisalSection
          v-if="contract?.status === 'UNDER_EVALUATION'"
          v-model:appraisal-price="formAppraisalPrice"
          :appraisals="contract?.evaluateGroups"
          @submit="onAppraisalPrice()" />
        <InstallmentSection
          v-if="contract?.status === 'PENDING_CONTRACT'"
          ref="installmentSectionRef"
          v-model="formMakeContract"
          :contract="contract" />
        <InstallmentPendingReviewSection
          v-if="contract?.status === 'PENDING_REVIEW'"
          ref="installmentPendingReviewSectionRef"
          v-model="formMakeContract"
          :contract="contract" />
        <PreContractAction
          v-if="contract?.status"
          v-model:confirm-appraisal="formConfirmAppraisal"
          v-model:request-appraisal="formRequestAppraisal"
          v-model:request-reappraisal="formRequestReappraisal"
          :disabled="!filledAllRequired"
          :existed-group="existedGroup"
          :is-mortgage-form-visible="isMortgageFormVisible"
          :sell-man="contract?.sellMan"
          :status="contract?.status"
          @cancel="onCancel()"
          @confirm-appraisal="onConfirmAppraisal()"
          @confirm-mortgage="onTriggerConfirmMortgage()"
          @make-contract="onTriggerMakeContract()"
          @pre-make-contract="onTriggerPreMakeContract()"
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
import AppraisalSection from '../components/appraisal/AppraisalSection.vue'
import AssetSection from '../components/make-contract/AssetSection.vue'
import InstallmentPendingReviewSection from '../components/make-contract/InstallmentPendingReviewSection.vue'
import InstallmentSection from '../components/make-contract/InstallmentSection.vue'
import MortgageForm from '../components/mortgage/MortgageForm.vue'
import ModalAssetDetail from '../components/pre-asset/ModalAssetDetail.vue'
import PreContractAction from '../components/PreContractAction.vue'
import PreContractDetailMenuAction from '../components/PreContractDetailMenuAction.vue'
import PreContractInformation from '../components/PreContractInformation.vue'
import { useAppraisal } from '../composables/appraisal/useAppraisal'
import { useMakeContract } from '../composables/make-contract/useMakeContract'
import { useMortgage } from '../composables/mortgage/useMortgage'
import { usePreAsset } from '../composables/pre-asset/usePreAsset'
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
  existedGroup,
  onActiveAsset,
  openModal,
  onEdit,
  onCancel,
  onPrint,
  useFetch,
  fetch
} = useInitDetail()
const { formPreAsset, formKey: formKeyPreAsset, onUpdatePreAsset, onInitPreAsset, mount: mountPreAsset } = usePreAsset(useFetch)
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
const { formMortgage, isMortgageFormVisible, onConfirmMortgage, onSubmitMortgage } = useMortgage(fetchMakeContract)
const {
  formMakeContract,
  formKey: formKeyMakeAContract,
  mount: mountMakeAContract,
  onConfirmPreMakeContract,
  onConfirmMakeContract
} = useMakeContract(useFetch)
const mortgageFormRef = useTemplateRef<InstanceType<typeof MortgageForm>>('mortgageFormRef')
const installmentSectionRef = useTemplateRef<InstanceType<typeof InstallmentSection>>('installmentSectionRef')
const assetSectionRef = useTemplateRef<InstanceType<typeof AssetSection>>('assetSectionRef')

const primaryCustomer = computed((): ICustomerById | null => {
  if (!contract.value?.customer) return null
  return contract.value?.customer
})

async function onTriggerPreMakeContract (): Promise<void> {
  const [validInstallment, validAsset] = await Promise.all([
    installmentSectionRef.value?.submit(),
    assetSectionRef.value?.submit()
  ])
  if (!validInstallment || !validAsset) return
  onConfirmPreMakeContract()
}

async function onTriggerMakeContract (): Promise<void> {
  onConfirmMakeContract()
}

function onTriggerConfirmMortgage (): void {
  mortgageFormRef.value?.submit()
}

function fetchMakeContract (): void {
  fetch(formMakeContract, mountMakeAContract)
}

onMounted((): void => {
  fetchMakeContract()
})
</script>
