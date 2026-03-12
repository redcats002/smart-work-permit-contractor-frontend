<template>
  <div>
    <div class="mx-auto max-w-6xl px-4 pt-4">
      <div class="flex items-center justify-between gap-2.5">
        <div class="flex gap-2.5">
          <SearchInput
            v-model="asset.search.value"
            @search="asset.fetch()" />
          <AssetFilter
            v-model:filters="asset.filters.value"
            @clear="asset.onClearFilters()"
            @search="asset.fetch()" />
        </div>
        <CreateButton
          :to="{ name: 'PreContractCreatePage' }"
          label="สร้างสัญญาใหม่" />
      </div>
    </div>
    <BasePage>
      <div class="mt-5">
        <AssetTable
          v-model:pagination="asset.pagination.value"
          v-model:sort-by="asset.sortBy.value"
          v-model:sort-order="asset.sortOrder.value"
          :items="asset.items.value"
          @update="asset.fetch()" />
      </div>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import useAssetList from '../../composables/useAssetList'
import AssetFilter from '../AssetFilter.vue'
import AssetTable from '../AssetTable.vue'

const asset = useAssetList()

onMounted((): void => {
  asset.fetch()
})
</script>
