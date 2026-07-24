<template>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div
        class="flex flex-col gap-5 pb-10">
        <template v-if="loadingStore.isLoading">
          <div class="grid grid-cols-2 gap-2">
            <Skeleton class="w-full h-20 mb-2" />
            <div class="grid grid-cols-1 gap-2">
              <Skeleton class="w-full h-20 mb-2" />
              <Skeleton class="w-full h-20 mb-2" />
            </div>
          </div>
        </template>
        <InformationDetail
          v-else
          :data="contract" />
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
        <FormAction
          @cancel="onCancel()"
          @confirm="onSave()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../../detail/components/InformationDetail.vue'
import AssetSection from '../../pre-contract-detail/components/make-contract/AssetSection.vue'
import InstallmentSection from '../../pre-contract-detail/components/make-contract/InstallmentSection.vue'
import { useInit } from '../composables/useInit'

const loadingStore = useLoadingStore()

const {
  contract,
  formAssets,
  formInstallment,
  activeAsset,
  activeIndex,
  assetCategory,
  onActiveAsset,
  onSave,
  onCancel,
  fetch
} = useInit()


onMounted((): void => {
  fetch()
})
</script>
