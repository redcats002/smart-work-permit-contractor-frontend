<template>
  <div>
    <div class="mx-auto max-w-6xl px-4 pt-4">
      <div
        class="flex items-center justify-between gap-2.5
      flex-col md:flex-row">
        <SearchInput
          v-model="contract.search.value"
          @search="contract.fetch()" />
        <ContractFilter
          v-model:filters="contract.filters.value"
          @clear="contract.onClearFilters()"
          @search="contract.fetch()" />
        <Spacer class="hidden md:flex" />
        <CreateButton
          :to="{ name: 'PreContractCreatePage' }"
          label="สร้างสัญญาใหม่" />
      </div>
    </div>
    <BasePage>
      <div class="mt-5">
        <ContractTable
          v-model:pagination="contract.pagination.value"
          v-model:sort-by="contract.sortBy.value"
          v-model:sort-order="contract.sortOrder.value"
          :items="contract.items.value"
          @update="contract.fetch()" />
      </div>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import useContractList from '../../composables/useContractList'
import ContractFilter from '../ContractFilter.vue'
import ContractTable from '../ContractTable.vue'

const contract = useContractList()

onMounted((): void => {
  contract.fetch()
})
</script>
