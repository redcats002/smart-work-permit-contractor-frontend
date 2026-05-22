<template>
  <section id="invoice-list-page">
    <PageTitle />
    <ExpensesFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{
          name: 'ExpenseCreatePage'
        }"
        label="เพิ่มบันทึกค่าใช้จ่ายใหม่" />
    </ExpensesFilter>
    <BasePage>
      <div>
        <RecordExpensesTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
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
import ExpensesFilter from '../components/ExpensesFilter.vue'
import RecordExpensesTable from '../components/RecordExpensesTable.vue'
import useList from '../composables/useList'

const { items, pagination, sortBy, sortOrder, search, filters, onClearFilters, fetch, onSearch } = useList()

onMounted((): void => {
  fetch()
})
</script>
