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
        <PreContractAction
          v-if="contract?.status"
          v-model:confirm-appraisal="formConfirmAppraisal"
          v-model:request-appraisal="formRequestAppraisal"
          v-model:request-reappraisal="formRequestReappraisal"
          :disabled="!filledAllRequired"
          :existed-group="existedGroup"
          :is-mortgage-form-visible="isMortgageFormVisible"
          :status="contract?.status"
          @cancel="onCancel()"
          @confirm-appraisal="onConfirmAppraisal()"
          @confirm-mortgage="onTriggerConfirmMortgage()"
          @make-contract="onTriggerMakeContract()"
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
  existedGroup,
  onActiveAsset,
  openModal,
  onEdit,
  onCancel,
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
const { formMakeContract, formKey: formKeyMakeAContract, mount: mountMakeAContract, onConfirmMakeContract } = useMakeContract(useFetch)
const mortgageFormRef = useTemplateRef<InstanceType<typeof MortgageForm>>('mortgageFormRef')
const installmentSectionRef = useTemplateRef<InstanceType<typeof InstallmentSection>>('installmentSectionRef')
const assetSectionRef = useTemplateRef<InstanceType<typeof AssetSection>>('assetSectionRef')

const primaryCustomer = computed((): ICustomerById | null => {
  if (!contract.value?.customer) return null
  return contract.value?.customer
})

async function onTriggerMakeContract (): Promise<void> {
  const [validInstallment, validAsset] = await Promise.all([
    installmentSectionRef.value?.submit(),
    assetSectionRef.value?.submit()
  ])
  if (!validInstallment || !validAsset) return
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
