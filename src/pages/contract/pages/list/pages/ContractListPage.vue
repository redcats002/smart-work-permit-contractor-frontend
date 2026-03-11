<template>
  <section id="contract-list-page">
    <PageTitle />
    <BaseTop>
      <Spacer />
      <CreateButton
        :to="{ name: 'PreContractCreatePage' }"
        label="สร้างสัญญาใหม่" />
    </BaseTop>
    <BaseTab
      v-model="tab"
      :items="tabItems" />
    <BaseTabWindow
      v-slot="{ component, item }"
      v-model="tab"
      :items="tabItems">
      <component
        :is="component"
        :key="item?.value"
        class="animate-fade-in" />
    </BaseTabWindow>
  </section>
</template>

<script setup lang="ts">
import { type Component, computed, defineAsyncComponent as dac, markRaw } from 'vue'
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useTabItems, { type ITabItemComponent } from '@/composables/useTabItems'

const CollateralTab = markRaw(dac((): Promise<Component> => import('../components/tab/CollateralTab.vue')))
const ContractTab = markRaw(dac((): Promise<Component> => import('../components/tab/ContractTab.vue')))

const { tab, tabItems } = useTabItems(
  computed((): ITabItemComponent[] => [
    { key: 'Collateral', label: 'หลักประกัน', value: 'collateral', instance: CollateralTab },
    { key: 'Contract', label: 'สัญญา', value: 'contract', instance: ContractTab }
  ])
)
</script>
