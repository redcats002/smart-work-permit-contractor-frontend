<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('history.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('history.subtitle') }}
        </p>
      </div>
      <button
        :disabled="exporting"
        class="inline-flex h-9.5 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface-card
          px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-subtle
          disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        @click="onExport()">
        <span aria-hidden="true">↓</span>
        {{ t('history.exportCsv') }}
      </button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <div class="mb-3.5 flex flex-wrap items-center gap-2.5">
        <InputText
          v-model="search"
          :placeholder="t('history.toolbar.searchPlaceholder')"
          class="min-w-45 flex-1" />
        <Select
          v-model="typeFilter"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          @change="onFilterChange()" />
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          @change="onFilterChange()" />
        <DatePicker
          v-model="dateFrom"
          :placeholder="t('history.toolbar.dateFrom')"
          date-format="dd/mm/yy"
          show-button-bar
          @update:model-value="onFilterChange()" />
        <DatePicker
          v-model="dateTo"
          :placeholder="t('history.toolbar.dateTo')"
          date-format="dd/mm/yy"
          show-button-bar
          @update:model-value="onFilterChange()" />
        <button
          class="px-1.5 text-sm text-text-secondary underline transition-colors hover:text-text-primary"
          type="button"
          @click="clearFilters()">
          {{ t('history.toolbar.clear') }}
        </button>
      </div>

      <p class="mb-2.5 font-mono text-xs text-text-tertiary">
        {{ t('history.resultCount', { count: pagination.count }) }}
      </p>

      <div
        v-if="loading"
        class="flex flex-col gap-2">
        <Skeleton
          v-for="n in 5"
          :key="n"
          class="rounded-lg!"
          height="3.25rem" />
      </div>

      <Empty
        v-else-if="isEmpty"
        :description="t('history.empty.description')"
        :title="t('history.empty.title')">
        <button
          class="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-text-primary px-5 text-sm font-semibold text-white
            transition-colors hover:bg-shell-sidebar-hover"
          type="button"
          @click="clearFilters()">
          {{ t('history.empty.clearFilters') }}
        </button>
      </Empty>

      <template v-else>
        <HistoryTable
          :items="items"
          @select-row="openDetail($event)" />
        <Paginate
          v-model:pagination="pagination"
          @update="onPageChange()" />
      </template>
    </div>

    <HistoryDetailDrawer
      :detail="selectedDetail"
      :loading="detailLoading"
      :open="drawerOpen"
      @close="closeDetail()" />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/display/Empty.vue'
import Paginate from '@/components/table/Paginate.vue'
import HistoryDetailDrawer from '../components/HistoryDetailDrawer.vue'
import HistoryTable from '../components/HistoryTable.vue'
import { useHistory } from '../composables/useHistory'

interface IFilterOption {
  label: string
  value: string
}

const { t } = useI18n()

const {
  items,
  loading,
  exporting,
  search,
  typeFilter,
  statusFilter,
  dateFrom,
  dateTo,
  pagination,
  isEmpty,
  drawerOpen,
  detailLoading,
  selectedDetail,
  fetchHistory,
  onFilterChange,
  onPageChange,
  clearFilters,
  openDetail,
  closeDetail,
  exportCsv
} = useHistory()

// Status is deliberately limited to the two terminal states — history is a
// read-only archive, live permits stay on /permits. See docs/modules/history/context.md.
const statusOptions: ComputedRef<IFilterOption[]> = computed((): IFilterOption[] => [
  { label: t('history.status.all'), value: 'all' },
  { label: t('history.status.CLOSED'), value: 'CLOSED' },
  { label: t('history.status.EXPIRED'), value: 'EXPIRED' }
])

const typeOptions: ComputedRef<IFilterOption[]> = computed((): IFilterOption[] => [
  { label: t('history.type.all'), value: 'all' },
  { label: t('history.type.hot'), value: 'hot' },
  { label: t('history.type.confined'), value: 'confined' },
  { label: t('history.type.heights'), value: 'heights' }
])

function onExport (): void {
  void exportCsv()
}

onMounted((): void => {
  void fetchHistory()
})
</script>
