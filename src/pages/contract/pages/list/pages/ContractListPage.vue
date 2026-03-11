<template>
  <section id="contract-list-page">
    <PageTitle />

    <!-- Tabs -->
    <div class="border-b border-surface-200">
      <div class="mx-auto max-w-6xl px-4 flex">
        <button
          :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200',
            activeTab === 'collateral'
              ? 'border-primary text-primary'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          ]"
          @click="setTab('collateral')">
          ประเมินหลักทรัพย์
        </button>
        <button
          :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200',
            activeTab === 'contract'
              ? 'border-primary text-primary'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          ]"
          @click="setTab('contract')">
          สัญญา
        </button>
      </div>
    </div>

    <!-- Action bar -->
    <div class="mx-auto max-w-6xl px-4 pt-4">
      <div class="flex items-center gap-2.5">
        <SearchInput
          v-model="currentSearch"
          @search="onSearch()" />
        <CollateralFilter
          v-if="activeTab === 'collateral'"
          v-model:filters="collateralFilters"
          @clear="collateral.onClearFilters()"
          @search="collateral.fetch()" />
        <ContractFilter
          v-else
          v-model:filters="contractFilters"
          :loan-type-options="contract.loanTypeOptions.value"
          @clear="contract.onClearFilters()"
          @search="contract.fetch()" />
        <Spacer />
        <CreateButton
          :to="{}"
          label="สร้างสัญญาใหม่" />
      </div>
    </div>

    <!-- Table -->
    <BasePage>
      <div class="mt-5">
        <CollateralTable
          v-if="activeTab === 'collateral'"
          v-model:pagination="collateral.pagination.value"
          v-model:sort-by="collateral.sortBy.value"
          v-model:sort-order="collateral.sortOrder.value"
          :items="collateral.items.value"
          @update="collateral.fetch()" />
        <ContractTable
          v-else
          v-model:pagination="contract.pagination.value"
          v-model:sort-by="contract.sortBy.value"
          v-model:sort-order="contract.sortOrder.value"
          :items="contract.items.value"
          @update="contract.fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CollateralFilter from '../components/CollateralFilter.vue'
import CollateralTable from '../components/CollateralTable.vue'
import ContractFilter from '../components/ContractFilter.vue'
import ContractTable from '../components/ContractTable.vue'
import useCollateralList from '../composables/useCollateralList'
import useContractList from '../composables/useContractList'

const activeTab = ref<'collateral' | 'contract'>('collateral')

const collateral = useCollateralList()
const contract = useContractList()

const collateralFilters = collateral.filters
const contractFilters = contract.filters

const currentSearch = computed({
  get (): string {
    return activeTab.value === 'collateral'
      ? collateral.search.value
      : contract.search.value
  },
  set (val: string): void {
    if (activeTab.value === 'collateral') {
      collateral.search.value = val
    } else {
      contract.search.value = val
    }
  }
})

function onSearch (): void {
  if (activeTab.value === 'collateral') {
    collateral.fetch()
  } else {
    contract.fetch()
  }
}

function setTab (tab: 'collateral' | 'contract'): void {
  activeTab.value = tab
  onSearch()
}

onMounted((): void => {
  collateral.fetch()
})
</script>
