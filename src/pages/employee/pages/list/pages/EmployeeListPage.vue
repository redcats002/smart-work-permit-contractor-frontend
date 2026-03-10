<template>
  <section id="employee-list-page">
    <PageTitle />
    <EmployeeFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        :to="{
          name: 'EmployeeCreatePage'
        }"
        label="เพิ่มพนักงานใหม่" />
    </EmployeeFilter>
    <BasePage>
      <div class="mt-5">
        <EmployeeTable
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
import EmployeeFilter from '../components/EmployeeFilter.vue'
import EmployeeTable from '../components/EmployeeTable.vue'
import useList from '../composables/useList'

const { filters, items, pagination, sortBy, sortOrder, search, fetch, onClearFilters, onDelete } = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
