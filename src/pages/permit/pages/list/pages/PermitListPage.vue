<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ mode === 'permits' ? t('permit.list.title') : t('history.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ mode === 'permits' ? t('permit.list.subtitle') : t('history.subtitle') }}
        </p>
      </div>

      <button
        v-if="mode === 'permits'"
        class="inline-flex h-10.5 shrink-0 items-center justify-center gap-2 rounded-lg bg-text-primary px-5 text-sm
          font-semibold text-white transition-colors hover:bg-shell-sidebar-hover"
        type="button"
        @click="router.push({ name: 'PermitCreatePage' })">
        <span aria-hidden="true">＋</span>
        {{ t('permit.list.newPermit') }}
      </button>
    </div>

    <!-- wayfinder 110 — "History" was cut from the menu; its search/filters/table/CSV export now
         live here as a view mode on the same page, since they were the only thing it had that this
         page's own card grid did not. -->
    <div class="flex gap-1 border-b border-border px-4 md:px-8">
      <button
        v-for="tab in viewModeTabs"
        :key="tab.value"
        :class="mode === tab.value
          ? 'border-b-2 border-text-primary font-semibold text-text-primary'
          : 'border-b-2 border-transparent text-text-secondary hover:text-text-primary'"
        class="px-3 py-2.5 text-sm transition-colors"
        type="button"
        @click="setMode(tab.value)">
        {{ tab.label }}
      </button>
    </div>

    <template v-if="mode === 'permits'">
      <div
        v-if="checklistVisible"
        class="px-4 pt-4 md:px-8">
        <OnboardingChecklist
          :items="checklistItems"
          @dismiss="dismissChecklist()" />
      </div>

      <div class="px-4 pt-4 md:px-8">
        <InputText
          v-model="search"
          :placeholder="t('permit.list.searchPlaceholder')"
          class="w-full max-w-sm" />
      </div>

      <div class="flex flex-wrap gap-2 px-4 py-4 md:px-8">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          :class="filter === chip.value
            ? 'border border-text-primary bg-text-primary text-white'
            : 'border border-border-strong bg-white text-text-secondary hover:border-text-tertiary'"
          class="h-8.5 rounded-lg px-4 text-xs font-semibold transition-colors"
          type="button"
          @click="setFilter(chip.value)">
          {{ chip.label }}
        </button>
      </div>

      <div class="px-4 pb-8 md:px-8">
        <div
          v-if="loading"
          class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <Skeleton
            v-for="n in 4"
            :key="n"
            class="rounded-xl!"
            height="9.5rem" />
        </div>

        <Empty
          v-else-if="isEmpty"
          :description="t('permit.list.empty.description')"
          :title="t('permit.list.empty.title')" />

        <template v-else>
          <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            <PermitCard
              v-for="permit in items"
              :key="permit.id"
              :permit="permit" />
          </div>

          <div class="mt-4 flex justify-end">
            <Paginate
              v-model:pagination="pagination"
              @update="fetchPermits()" />
          </div>
        </template>
      </div>
    </template>

    <div
      v-else
      class="px-4 py-6 md:px-8">
      <PermitHistoryView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Empty from '@/components/display/Empty.vue'
import Paginate from '@/components/table/Paginate.vue'
import { useMyPermits, type TPermitListFilter } from '../composables/useMyPermits'
import { useOnboardingChecklist } from '../composables/useOnboardingChecklist'
import PermitCard from '../components/PermitCard.vue'
import OnboardingChecklist from '../components/OnboardingChecklist.vue'
import PermitHistoryView from '../components/PermitHistoryView.vue'

type TViewMode = 'permits' | 'history'

interface IFilterChip {
  value: TPermitListFilter
  label: string
}

interface IViewModeTab {
  value: TViewMode
  label: string
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { items, loading, filter, search, pagination, isEmpty, setFilter, fetchPermits } = useMyPermits()
const { items: checklistItems, visible: checklistVisible, dismiss: dismissChecklist, refresh: refreshChecklist } = useOnboardingChecklist()

// Deep links into the old `/history` route redirect here with `?view=history` (History.router.ts) —
// this is the one place that query param is read, so a bookmark or a link from elsewhere still
// lands the user in the right tab instead of a 404.
const mode: Ref<TViewMode> = ref(route.query.view === 'history' ? 'history' : 'permits')

const viewModeTabs: ComputedRef<IViewModeTab[]> = computed((): IViewModeTab[] => [
  { value: 'permits', label: t('permit.list.viewMode.permits') },
  { value: 'history', label: t('permit.list.viewMode.history') }
])

const filterChips: ComputedRef<IFilterChip[]> = computed((): IFilterChip[] => [
  { value: 'all', label: t('permit.list.filter.all') },
  { value: 'active', label: t('permit.status.ACTIVE') },
  { value: 'pending', label: t('permit.status.PENDING') },
  { value: 'closed', label: t('permit.status.CLOSED') }
])

// Loaded lazily, the first time the "Permits" tab is actually shown — landing on `?view=history`
// (the old `/history` deep link) has no reason to fire this fetch at all.
const permitsLoaded: Ref<boolean> = ref(false)

async function loadPermits (): Promise<void> {
  await fetchPermits()
  // wayfinder 077 — the checklist's "created your first permit" row is wired off THIS same
  // fetch (the default 'all' filter's unfiltered count), never a second, parallel query, so it
  // can never drift from what the list below it shows.
  void refreshChecklist(pagination.value.count > 0)
  permitsLoaded.value = true
}

function setMode (value: TViewMode): void {
  mode.value = value
}

watch(mode, (): void => {
  // Keeps a reload of this page (or a shared link) on the same tab the user left it on.
  void router.replace({ query: { ...route.query, view: mode.value === 'history' ? 'history' : undefined } })
  if (mode.value === 'permits' && !permitsLoaded.value) void loadPermits()
})

onMounted(async (): Promise<void> => {
  if (mode.value === 'permits') await loadPermits()
})
</script>

<style scoped>

</style>
