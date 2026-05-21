<template>
  <section id="customer-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <WarehouseFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{
          name: 'WarehouseCreatePage'
        }"
        label="เพิ่มคลังใหม่" />
    </WarehouseFilter>
    <BasePage>
      <div>
        <WarehouseTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          @delete="onDelete($event)"
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import WarehouseFilter from '../components/WarehouseFilter.vue'
import WarehouseTable from '../components/WarehouseTable.vue'
import useList from '../composables/useList'

const { filters, items, pagination, sortBy, sortOrder, search, fetch, onClearFilters, onDelete, onSearch } = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
