<template>
  <section id="asset-detail-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-4">
        <AssetInfoSection
          :asset-info="assetInfo"
          :contract-info="contractInfo"
          @update:asset-status="onUpdateAssetStatus($event)" />
        <AssetMediaSection
          :documents="documents"
          :images="images" />
        <AssetHistorySection :items="history" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetHistorySection from '../components/AssetHistorySection.vue'
import AssetInfoSection from '../components/AssetInfoSection.vue'
import AssetMediaSection from '../components/AssetMediaSection.vue'
import { useRoute } from 'vue-router'
import { useDetail } from '../composables/useDetail'

const route = useRoute()
const assetId = Number(route.params?.id || 0)
const { assetInfo, contractInfo, images, documents, history } = useDetail(assetId)

function onUpdateAssetStatus (status: string): void {
  assetInfo.value.status = status
}
</script>

<style scoped></style>
