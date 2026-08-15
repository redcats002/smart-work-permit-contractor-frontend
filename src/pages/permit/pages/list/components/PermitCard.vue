<template>
  <router-link
    :class="typeBorderClass"
    :to="{ name: 'PermitDetailPage', params: { id: permit.id } }"
    class="block min-w-0 rounded-xl border border-border bg-surface-card p-4 shadow-xs transition-shadow hover:shadow-lg">
    <div class="flex items-start justify-between gap-2.5">
      <span class="truncate font-mono text-[11px] tracking-wide text-text-tertiary">
        {{ permit.id }}
      </span>
      <span
        :class="[statusClass.bg, statusClass.fg]"
        class="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
        {{ t(`permit.status.${permit.status}`) }}
      </span>
    </div>

    <p class="mt-2 mb-0.5 text-[15px] font-semibold tracking-tight text-text-primary break-words">
      {{ permit.title }}
    </p>
    <p class="mb-3 text-xs text-text-secondary break-words">
      {{ permit.location }}
    </p>

    <div class="flex flex-wrap items-center gap-2.5">
      <span
        :class="[typeChipClass.bg, typeChipClass.fg]"
        class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-semibold">
        {{ t(`permit.type.${permit.type}`) }}
      </span>
      <span class="text-xs text-text-secondary">📅 {{ formattedDate }}</span>
      <span class="text-xs text-text-secondary">🕗 {{ permit.workTimeStart }}–{{ permit.workTimeEnd }}</span>
      <span
        v-if="showEntrants"
        class="ml-auto flex items-center gap-1.5 text-xs font-semibold text-status-rejected-fg">
        <span class="size-[7px] shrink-0 animate-pulse rounded-full bg-status-rejected-fg" />
        {{ t('permit.list.card.inside', { count: permit.entrantsInside ?? 0 }) }}
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'

interface IProps {
  permit: IPermitListItem
}

const props = defineProps<IProps>()

const { t, d } = useI18n()

const TYPE_BORDER_CLASS: Record<TPermitType, string> = {
  hot: 'border-l-permit-type-hot-fg',
  confined: 'border-l-permit-type-confined-fg',
  heights: 'border-l-permit-type-heights-fg'
}

const TYPE_CHIP_CLASS: Record<TPermitType, { bg: string, fg: string }> = {
  hot: { bg: 'bg-permit-type-hot-bg', fg: 'text-permit-type-hot-fg' },
  confined: { bg: 'bg-permit-type-confined-bg', fg: 'text-permit-type-confined-fg' },
  heights: { bg: 'bg-permit-type-heights-bg', fg: 'text-permit-type-heights-fg' }
}

const STATUS_CLASS: Record<TPermitStatus, { bg: string, fg: string }> = {
  DRAFT: { bg: 'bg-status-draft-bg', fg: 'text-status-draft-fg' },
  PENDING: { bg: 'bg-status-pending-bg', fg: 'text-status-pending-fg' },
  ACTIVE: { bg: 'bg-status-active-bg', fg: 'text-status-active-fg' },
  FIRE_MONITOR: { bg: 'bg-status-fire-monitor-bg', fg: 'text-status-fire-monitor-fg' },
  REJECTED: { bg: 'bg-status-rejected-bg', fg: 'text-status-rejected-fg' },
  CLOSED: { bg: 'bg-status-closed-bg', fg: 'text-status-closed-fg' },
  EXPIRED: { bg: 'bg-status-expired-bg', fg: 'text-status-expired-fg' }
}

const typeBorderClass: ComputedRef<string> = computed((): string => `border border-l-[5px] ${TYPE_BORDER_CLASS[props.permit.type]}`)
const typeChipClass: ComputedRef<{ bg: string, fg: string }> = computed((): { bg: string, fg: string } => TYPE_CHIP_CLASS[props.permit.type])
const statusClass: ComputedRef<{ bg: string, fg: string }> = computed((): { bg: string, fg: string } => STATUS_CLASS[props.permit.status])

const formattedDate: ComputedRef<string> = computed((): string => d(new Date(props.permit.workDate), 'short'))

/** Confined-space permits, ACTIVE, with entrants still checked in — see context.md § My Permits. */
const showEntrants: ComputedRef<boolean> = computed((): boolean => (
  props.permit.type === 'confined'
  && props.permit.status === 'ACTIVE'
  && (props.permit.entrantsInside ?? 0) > 0
))
</script>

<style scoped>

</style>
