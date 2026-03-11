<template>
  <div>
    <div class="mx-auto max-w-6xl px-4 pt-4">
      <div class="flex items-center gap-2.5">
        <SearchInput
          v-model="collateral.search.value"
          @search="collateral.fetch()" />
        <CollateralFilter
          v-model:filters="collateral.filters.value"
          @clear="collateral.onClearFilters()"
          @search="collateral.fetch()" />
      </div>
    </div>
    <BasePage>
      <div class="mt-5">
        <CollateralTable
          v-model:pagination="collateral.pagination.value"
          v-model:sort-by="collateral.sortBy.value"
          v-model:sort-order="collateral.sortOrder.value"
          :items="collateral.items.value"
          @update="collateral.fetch()" />
      </div>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import useCollateralList from '../../composables/useCollateralList'
import CollateralFilter from '../CollateralFilter.vue'
import CollateralTable from '../CollateralTable.vue'

const collateral = useCollateralList()

onMounted((): void => {
  collateral.fetch()
})
</script>
