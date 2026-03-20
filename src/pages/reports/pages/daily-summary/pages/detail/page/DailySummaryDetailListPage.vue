<template>
  <section id="employee-list-page">
    <PageTitle />
    <BackButton />
    <BaseTop
      class="flex justify-between items-center">
      <div class="flex gap-1.5 items-center">
        ประจำเดือน
        <LabelField>
          <DatePickerInput v-model="filters.monthly" />
        </LabelField>
      </div>
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์" />
    </BaseTop>

    <InformationDetail
      :data="items"
      class="mt-5" />
    <BasePage>
      <div class="mt-5">
        <DailySummaryTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items?.items"
          @delete="onDelete($event)"
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryTable from '../components/DailySummaryTable.vue'
import useList from '../composables/useList'
import BackButton from '@/components/button/BackButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import InformationDetail from '../components/InformationDetail.vue'

const {
  filters,
  items,
  pagination,
  sortBy,
  sortOrder,
  fetch,
  onDelete
} = useList() // TODO: update when api ready

onMounted((): void => {
  fetch()
})

</script>

<style scoped></style>
