<template>
  <section id="customer-list-page">
    <PageTitle />
    <CustomerFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{
          name: 'CustomerCreatePage'
        }"
        label="เพิ่มลูกค้าใหม่" />
    </CustomerFilter>
    <BasePage>
      <div>
        <CustomerTable
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
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerFilter from '../components/CustomerFilter.vue'
import CustomerTable from '../components/CustomerTable.vue'
import useList from '../composables/useList'

const { filters, items, pagination, sortBy, sortOrder, search, fetch, onClearFilters, onDelete, onSearch } = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
