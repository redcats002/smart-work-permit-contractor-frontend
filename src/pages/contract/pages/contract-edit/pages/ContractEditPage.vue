<template>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="flex flex-col gap-5 pb-10">
        <InformationDetail :data="contract" />
        <AssetSection
          v-if="formAssets.length"
          v-model:pre-assets="formAssets"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          @active="onActiveAsset($event)" />
        <InstallmentSection
          ref="installmentSectionRef"
          v-model="formInstallment"
          :contract="contract" />
        <div class="flex justify-end">
          <Button
            class="px-6 h-10 text-sm font-medium"
            type="button"
            @click="onSave()">
            บันทึก
          </Button>
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IUpdateContractPayload } from '@/models/request/contract/ContractReq.model'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../../detail/components/InformationDetail.vue'
import AssetSection from '../../pre-contract-detail/components/AssetSection.vue'
import InstallmentSection from '../../pre-contract-detail/components/InstallmentSection.vue'
import { useInitDetail } from '../composables/useInitDetail'

const router = useRouter()
const ContractService: IContractProvider = new ContractProvider()

const {
  contractId,
  contract,
  formAssets,
  formInstallment,
  activeAsset,
  activeIndex,
  assetCategory,
  onActiveAsset,
  fetch
} = useInitDetail()

const installmentSectionRef = useTemplateRef<InstanceType<typeof InstallmentSection>>('installmentSectionRef')

async function useSave (): Promise<void> {
  const valid = await installmentSectionRef.value?.submit()
  if (!valid) return
  const payload: IUpdateContractPayload = {
    installmentCount: formatter.numberParseFloat(formInstallment.value.installmentCount),
    interestType: formInstallment.value.interestType!,
    annualInterestRate: formatter.numberParseFloat(formInstallment.value.annualInterestRate)
  }
  await ContractService.updateContract(contractId.value, payload)
  toast.success('บันทึกสัญญาเรียบร้อยแล้ว')
  router.push({ name: 'ContractDetailPage', params: { id: contractId.value } })
}

function onSave (): void {
  handleLoading(useSave)
}

onMounted((): void => {
  fetch()
})
</script>
