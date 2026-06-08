<template>
  <section id="work-asset-appraisal-list-page">
    <NewContentButton
      :show="notificationStore.isNewWork"
      label="มีงานใหม่"
      @click="fetch()" />
    <PageTitle />
    <WorkFilter
      v-model:filters="filters"
      v-model:search="search"
      @clear="onClearFilters()"
      @search="onSearch()" />
    <BasePage>
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
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="items"
          class="animate-fade-in"
          @update="fetch()" />
      </BaseTabWindow>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/Notification'
import BasePage from '@/components/base/BasePage.vue'
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import NewContentButton from '@/components/button/NewContentButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import WorkFilter from '../components/WorkFilter.vue'
import useInit from '../composables/useInit'
import useList from '../composables/useList'

const { tab, tabItems } = useInit()
const { filters, search, fetch, onClearFilters, items, pagination, sortBy, sortOrder, onSearch } = useList(tab)
const notificationStore = useNotificationStore()


onMounted((): void => {
  fetch()
})

watch(tab, (): void => {
  fetch()
})

</script>

<style scoped></style>
