<template>
  <section id="access-log-list-page">
    <PageTitle />
    <AccessLogFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <BasePage>
      <AccessLogTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AccessLogFilter from '../components/AccessLogFilter.vue'
import AccessLogTable from '../components/AccessLogTable.vue'
import useList from '../composables/useList'

const { fetch, filters, items, pagination, sortBy, sortOrder, search, onClearFilters } = useList()

</script>

<style scoped>

</style>
