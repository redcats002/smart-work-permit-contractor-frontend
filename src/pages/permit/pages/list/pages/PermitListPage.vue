<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('permit.list.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('permit.list.subtitle') }}
        </p>
      </div>
      <button
        class="inline-flex h-10.5 shrink-0 items-center justify-center gap-2 rounded-lg bg-text-primary px-5 text-sm
          font-semibold text-white transition-colors hover:bg-shell-sidebar-hover"
        type="button"
        @click="router.push({ name: 'PermitCreatePage' })">
        <span aria-hidden="true">＋</span>
        {{ t('permit.list.newPermit') }}
      </button>
    </div>

    <div
      v-if="checklistVisible"
      class="px-4 pt-4 md:px-8">
      <OnboardingChecklist
        :items="checklistItems"
        @dismiss="dismissChecklist()" />
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

      <div
        v-else
        class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <PermitCard
          v-for="permit in items"
          :key="permit.id"
          :permit="permit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Empty from '@/components/display/Empty.vue'
import { useMyPermits, type TPermitListFilter } from '../composables/useMyPermits'
import { useOnboardingChecklist } from '../composables/useOnboardingChecklist'
import PermitCard from '../components/PermitCard.vue'
import OnboardingChecklist from '../components/OnboardingChecklist.vue'

interface IFilterChip {
  value: TPermitListFilter
  label: string
}

const { t } = useI18n()
const router = useRouter()

const { items, loading, filter, pagination, isEmpty, setFilter, fetchPermits } = useMyPermits()
const { items: checklistItems, visible: checklistVisible, dismiss: dismissChecklist, refresh: refreshChecklist } = useOnboardingChecklist()

const filterChips: ComputedRef<IFilterChip[]> = computed((): IFilterChip[] => [
  { value: 'all', label: t('permit.list.filter.all') },
  { value: 'active', label: t('permit.status.ACTIVE') },
  { value: 'pending', label: t('permit.status.PENDING') },
  { value: 'closed', label: t('permit.status.CLOSED') }
])

onMounted(async (): Promise<void> => {
  await fetchPermits()
  // wayfinder 077 — the checklist's "created your first permit" row is wired off THIS same
  // fetch (the default 'all' filter's unfiltered count), never a second, parallel query, so it
  // can never drift from what the list below it shows.
  void refreshChecklist(pagination.value.count > 0)
})
</script>

<style scoped>

</style>
