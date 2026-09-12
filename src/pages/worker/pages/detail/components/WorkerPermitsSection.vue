<template>
  <div class="rounded-[10px] border-[1.5px] border-border-input bg-surface-card p-4 md:px-[18px]">
    <h2 class="mb-3 text-sm font-semibold text-text-primary">
      {{ t('worker.detail.sectionPermits') }}
    </h2>

    <p
      v-if="!permits.length"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
      data-test="worker-permits-empty">
      {{ t('worker.detail.permitsEmpty') }}
    </p>

    <ul
      v-else
      class="flex flex-col gap-2"
      data-test="worker-permits-list">
      <li
        v-for="permit in permits"
        :key="permit.id">
        <RouterLink
          :to="{ name: 'PermitDetailPage', params: { id: permit.id } }"
          class="flex items-center justify-between gap-2.5 rounded-[9px] border border-border bg-surface-app px-3.5 py-2.5
            text-[13px] transition-colors hover:bg-surface-subtle">
          <span class="min-w-0">
            <span class="block truncate font-medium text-text-primary">{{ permit.title }}</span>
            <span class="block truncate font-mono text-[11px] text-text-tertiary">{{ permit.id }} · {{ permit.roleOnPermit }}</span>
          </span>
          <span
            :class="[STATUS_CLASS[permit.status as TPermitStatus]?.bg, STATUS_CLASS[permit.status as TPermitStatus]?.fg]"
            class="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-bold whitespace-nowrap">
            {{ t(`permit.status.${permit.status}`) }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { IWorkerDetailPermit } from '@/models/modules/worker/Worker.model'

/**
 * wayfinder 062 — "every permit this worker appears on, with status, linking to the permit." This
 * is the field report's other half fixed by 063: once Step 4 actually saves `workerId`, the
 * permit shows up here, because the API's own `GET /workers/:id` reads the FK, not a name join.
 *
 * Status colors mirror `PermitCard.vue`'s own map (not exported from there — small, local
 * duplication rather than a cross-module import for one constant object).
 */
interface IProps {
  permits: IWorkerDetailPermit[]
}

defineProps<IProps>()

const { t } = useI18n()

const STATUS_CLASS: Record<TPermitStatus, { bg: string, fg: string }> = {
  DRAFT: { bg: 'bg-status-draft-bg', fg: 'text-status-draft-fg' },
  PENDING: { bg: 'bg-status-pending-bg', fg: 'text-status-pending-fg' },
  ACTIVE: { bg: 'bg-status-active-bg', fg: 'text-status-active-fg' },
  FIRE_MONITOR: { bg: 'bg-status-fire-monitor-bg', fg: 'text-status-fire-monitor-fg' },
  REJECTED: { bg: 'bg-status-rejected-bg', fg: 'text-status-rejected-fg' },
  CLOSED: { bg: 'bg-status-closed-bg', fg: 'text-status-closed-fg' },
  EXPIRED: { bg: 'bg-status-expired-bg', fg: 'text-status-expired-fg' }
}
</script>

<style scoped></style>
