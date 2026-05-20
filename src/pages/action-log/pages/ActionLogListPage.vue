<template>
  <section id="action-log-list-page">
    <PageTitle />
    <ActionLogFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()" />
    <BasePage>
      <ActionLogTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ActionLogFilter from '../components/ActionLogFilter.vue'
import ActionLogTable from '../components/ActionLogTable.vue'
import useList from '../composables/useList'

const { fetch, filters, items, pagination, sortBy, sortOrder, search, onClearFilters, onSearch } = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped>

</style>
