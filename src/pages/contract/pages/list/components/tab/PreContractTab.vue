<template>
  <div>
    <BasePage>
      <div
        class="flex items-center justify-between gap-2.5
      flex-col md:flex-row">
        <SearchInput
          v-model="search"
          @search="fetch()" />
        <PreContractFilter
          v-model:filters="filters"
          @clear="onClearFilters()"
          @search="fetch()" />
        <Spacer class="hidden md:flex" />
        <CreateButton
          :to="{ name: 'PreContractCreatePage' }"
          label="สร้างสัญญาใหม่" />
      </div>
      <div class="mt-5">
        <PreContractTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @update="fetch()" />
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
import usePreContractList from '../../composables/usePreContractList'
import PreContractFilter from '../PreContractFilter.vue'
import PreContractTable from '../PreContractTable.vue'

const { search, filters, items, sortBy, sortOrder, pagination, fetch, onClearFilters } = usePreContractList()

onMounted((): void => {
  fetch()
})
</script>
