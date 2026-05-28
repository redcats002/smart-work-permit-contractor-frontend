<template>
  <section id="asset-detail-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-4">
        <template v-if="loading">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton height="16rem" />
            <Skeleton height="16rem" />
          </div>
          <Skeleton height="12rem" />
          <Skeleton height="12rem" />
        </template>
        <template v-else-if="detail">
          <AssetInfoSection
            :detail="detail"
            @update:asset-status="onUpdateStatus($event)" />
          <AssetMediaSection
            :files="detail.files"
            :images="detail.images" />
          <AssetHistorySection
            :asset-id="assetId"
            :loan-amount="detail.contract.loanAmount"
            :sale-date="detail.saleDate"
            :sale-price="detail.salePrice"
            :status="detail.status"
            @sell="onSell($event)" />
        </template>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetHistorySection from '../components/AssetHistorySection.vue'
import AssetInfoSection from '../components/AssetInfoSection.vue'
import AssetMediaSection from '../components/AssetMediaSection.vue'
import { useDetail } from '../composables/useDetail'

const route = useRoute()
const assetId = computed((): number => Number(route.params.id))
const { detail, loading, fetch, onSell, onUpdateStatus } = useDetail(assetId.value)

onMounted((): void => {
  void fetch()
})
</script>

<style scoped></style>
