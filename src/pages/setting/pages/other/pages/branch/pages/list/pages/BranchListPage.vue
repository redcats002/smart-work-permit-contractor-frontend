<template>
  <section id="customer-list-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BranchFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()">
      <CreateButton
        :to="{
          name: 'BranchCreatePage'
        }"
        label="เพิ่มสาขาใหม่" />
    </BranchFilter>
    <BasePage>
      <div class="mt-5">
        <BranchTable
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
import BranchFilter from '../components/BranchFilter.vue'
import BranchTable from '../components/BranchTable.vue'
import useList from '../composables/useList'

const { filters, items, pagination, sortBy, sortOrder, search, fetch, onClearFilters, onDelete, onSearch } = useList()

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
