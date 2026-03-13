<template>
  <section id="work-asset-appraisal-list-page">
    <PageTitle />
    <WorkFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="fetch()" />
    <BasePage />
    <BaseTab
      v-model="tab"
      :items="tabItems"
      full />
    <BaseTabWindow
      v-slot="{ component, item }"
      v-model="tab"
      :items="tabItems"
      class="mt-4">
      <component
        :is="component"
        :key="item?.value"
        v-model:pagination="pagination"
        :items="items"
        class="animate-fade-in" />
    </BaseTabWindow>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BaseTab from '@/components/base/BaseTab.vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import useList from '../composables/useList'
import WorkFilter from '../components/WorkFilter.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import useInit from '../composables/useInit'

const { filters, search, fetch, onClearFilters, items, pagination } = useList()


onMounted((): void => {
  fetch()
})
const { tab, tabItems } = useInit()

</script>

<style scoped></style>
