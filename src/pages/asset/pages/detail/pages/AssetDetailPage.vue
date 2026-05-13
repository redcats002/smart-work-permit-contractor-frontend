<template>
  <section id="asset-detail-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div
        v-if="detail"
        class="grid grid-cols-1 gap-4">
        <AssetInfoSection
          :detail="detail"
          @update:asset-status="updateStatus($event)" />
        <AssetMediaSection
          :files="detail.files"
          :images="detail.images" />
        <AssetHistorySection
          :items="[]"
          :loan-amount="detail.contract.loanAmount"
          :sale-date="detail.saleDate"
          :sale-price="detail.salePrice"
          @sell="sell($event)" />
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
import AssetHistorySection from '../components/AssetHistorySection.vue'
import AssetInfoSection from '../components/AssetInfoSection.vue'
import AssetMediaSection from '../components/AssetMediaSection.vue'
import { useRoute } from 'vue-router'
import { useDetail } from '../composables/useDetail'

const route = useRoute()
const assetId = Number(route.params?.id || 0)
const { detail, fetch, sell, updateStatus } = useDetail(assetId)

onMounted((): void => {
  void fetch()
})
</script>

<style scoped></style>
