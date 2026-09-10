<template>
  <div class="flex flex-col gap-3 rounded-xl border border-border bg-surface-card p-4 md:p-5">
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm font-semibold text-text-primary">
        {{ t('permit.list.checklist.title') }}
      </p>
      <button
        :aria-label="t('permit.list.checklist.dismiss')"
        class="shrink-0 text-xs font-medium text-text-tertiary transition-colors hover:text-text-secondary"
        type="button"
        @click="emit('dismiss')">
        {{ t('permit.list.checklist.dismiss') }} ✕
      </button>
    </div>

    <ul class="flex flex-col gap-2">
      <li
        v-for="item in items"
        :key="item.key">
        <RouterLink
          :class="item.done ? 'text-text-tertiary line-through' : 'text-text-primary'"
          :to="item.to"
          class="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-surface-app">
          <span
            :class="item.done
              ? 'border-status-active-border bg-status-active-bg text-status-active-fg'
              : 'border-border-strong text-transparent'"
            aria-hidden="true"
            class="flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold">
            ✓
          </span>
          {{ t(item.labelKey) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOnboardingChecklistItem } from '../composables/useOnboardingChecklist'

interface IProps {
  items: IOnboardingChecklistItem[]
}

interface IEmits {
  dismiss: []
}

defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
</script>

<style scoped>

</style>
