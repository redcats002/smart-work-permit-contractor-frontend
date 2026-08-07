<template>
  <section id="daily-summary-list-page">
    <PageTitle />
    <BackButton />
    <DailySummaryFilter
      v-model:filters="filters"
      @search="onSearch()">
      <PrintButton
        class="md:mr-2"
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
      <CreateButton
        :to="{ name: 'DailySummaryCreatePage' }"
        label="สรุปประจำวัน" />
    </DailySummaryFilter>
    <BasePage>
      <DailySummaryTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :items="items"
        :row-class="() => 'cursor-pointer'"
        @row-click="onRowClick($event)"
        @update="fetch()" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { IDailySummaryListItem } from '@/models/response/report/daily-summary/DailySummaryRes'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import CreateButton from '@/components/button/CreateButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryFilter from '../components/DailySummaryFilter.vue'
import DailySummaryTable from '../components/DailySummaryTable.vue'
import useList from '../composables/useList'

const router = useRouter()

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  fetch,
  onSearch,
  onPrint
} = useList()

function onRowClick (event: { data: IDailySummaryListItem }): void {
  router.push({ name: 'DailySummaryDetailListPage', params: { id: event.data.id } })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
