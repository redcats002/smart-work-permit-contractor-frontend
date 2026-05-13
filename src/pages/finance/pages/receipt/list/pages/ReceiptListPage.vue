<template>
  <section id="invoice-list-page">
    <PageTitle />
    <ReceiptFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()">
      <CreateButton
        :to="{
          name: 'ReceiptCreatePage'
        }"
        label="ชำระเงิน/ออกใบเสร็จใหม่" />
    </ReceiptFilter>
    <BasePage>
      <ReceiptTable
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
import CreateButton from '@/components/button/CreateButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ReceiptFilter from '../components/ReceiptFilter.vue'
import ReceiptTable from '../components/ReceiptTable.vue'
import useList from '../composables/useList'

const { items, pagination, sortBy, sortOrder, search, filters, onClearFilters, fetch } = useList()

onMounted((): void => {
  fetch()
})
</script>
