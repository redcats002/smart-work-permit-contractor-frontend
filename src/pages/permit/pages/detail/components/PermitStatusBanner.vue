<template>
  <div
    v-if="variant"
    :class="style.wrapper"
    :data-test="`banner-${variant}`"
    class="mb-4.5 flex flex-col gap-3 rounded-xl border px-4.5 py-4 sm:flex-row sm:items-center sm:gap-4">
    <span
      :class="style.icon"
      aria-hidden="true"
      class="flex size-10.5 shrink-0 items-center justify-center rounded-[10px] text-xl">
      {{ style.glyph }}
    </span>

    <div class="min-w-0 flex-1">
      <p
        :class="style.title"
        class="text-sm font-bold">
        {{ t(`permit.detail.banner.${variant}.title`) }}
      </p>
      <p
        :class="style.body"
        class="mt-0.75 text-[12.5px] leading-relaxed break-words">
        {{ description }}
      </p>
      <p
        v-if="variant === 'rejected'"
        class="mt-1 font-mono text-[11.5px] text-text-tertiary break-words">
        {{ t('permit.detail.banner.rejected.meta', { who: rejectedByLabel }) }}
      </p>
    </div>

    <div class="flex shrink-0 flex-col items-start gap-1 sm:items-end">
      <slot name="action">
        <button
          v-if="editRouteName"
          class="inline-flex h-10.5 cursor-pointer items-center justify-center rounded-lg bg-primary px-4.5 text-[13px]
            font-semibold whitespace-nowrap text-white hover:bg-primary-emphasis"
          type="button"
          @click="router.push({ name: editRouteName, params: { id: permit.id } })">
          {{ t(`permit.detail.banner.${variant}.action`) }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

/**
 * Banner variants, design lines 434-458 plus the ACTIVE / CLOSED strips.
 *
 * `submitted` is not a wire status — it is the one-shot success card shown right after the wizard
 * submits, driven by a `?submitted=1` route query. Nothing sets that query today (the wizard's
 * Submit is still a stub, PMT-009), so the variant is reachable only by visiting the URL directly.
 */
export type TPermitBannerVariant = 'draft' | 'rejected' | 'submitted' | 'active' | 'activeHot' | 'closed'

interface IProps {
  permit: IPermitDetail
  justSubmitted?: boolean
  /**
   * Display name of the Safety Officer who rejected the permit. The permit payload does NOT carry
   * one — `rejectedReason` / `rejectedAt` are set but no `rejectedBy` column exists — so the page
   * reads it out of the audit trail's `PERMIT_REJECTED` entry and passes it down.
   */
  rejectedBy?: string
}

interface IBannerStyle {
  glyph: string
  wrapper: string
  icon: string
  title: string
  body: string
}

const props = withDefaults(defineProps<IProps>(), { justSubmitted: false, rejectedBy: '' })

const { t, d } = useI18n()
const router = useRouter()

const STYLE: Record<TPermitBannerVariant, IBannerStyle> = {
  draft: {
    glyph: '✏',
    wrapper: 'border-border-strong bg-surface-app',
    icon: 'bg-surface-muted',
    title: 'text-text-primary',
    body: 'text-text-secondary'
  },
  rejected: {
    glyph: '✕',
    wrapper: 'border-status-rejected-border bg-status-rejected-bg',
    icon: 'bg-white text-status-rejected-fg',
    title: 'text-status-rejected-fg-emphasis',
    body: 'text-status-rejected-fg'
  },
  submitted: {
    glyph: '✅',
    wrapper: 'border-status-active-border bg-status-active-bg',
    icon: 'bg-white',
    title: 'text-status-active-fg-emphasis',
    body: 'text-status-active-fg'
  },
  active: {
    glyph: '🟢',
    wrapper: 'border-status-active-border bg-status-active-bg',
    icon: 'bg-white',
    title: 'text-status-active-fg-emphasis',
    body: 'text-status-active-fg'
  },
  activeHot: {
    glyph: '🔥',
    wrapper: 'border-status-fire-monitor-border bg-status-fire-monitor-bg',
    icon: 'bg-white',
    title: 'text-status-fire-monitor-fg-emphasis',
    body: 'text-text-strong'
  },
  closed: {
    glyph: '🔒',
    wrapper: 'border-border-strong bg-surface-muted',
    icon: 'bg-white',
    title: 'text-status-closed-fg',
    body: 'text-text-secondary'
  }
}

const variant: ComputedRef<TPermitBannerVariant | null> = computed((): TPermitBannerVariant | null => {
  if (props.permit.status === 'DRAFT') return 'draft'
  if (props.permit.status === 'REJECTED') return 'rejected'
  if (props.permit.status === 'CLOSED') return 'closed'
  if (props.permit.status === 'PENDING') return props.justSubmitted ? 'submitted' : null
  if (props.permit.status === 'ACTIVE') return props.permit.type === 'hot' ? 'activeHot' : 'active'
  return null
})

const style: ComputedRef<IBannerStyle> = computed((): IBannerStyle => STYLE[variant.value ?? 'draft'])

const description: ComputedRef<string> = computed((): string => {
  if (variant.value === 'rejected') {
    return props.permit.rejectedReason ?? t('permit.detail.banner.rejected.noReason')
  }
  if (variant.value === 'closed' && props.permit.closedAt) {
    return t('permit.detail.banner.closed.descriptionAt', { when: d(new Date(props.permit.closedAt), 'long') })
  }
  return t(`permit.detail.banner.${variant.value ?? 'draft'}.description`)
})

const rejectedByLabel: ComputedRef<string> = computed((): string => props.rejectedBy || t('permit.detail.audit.unknownActor'))

/**
 * DRAFT's "Edit Permit" opens the resume route against THIS permit's own id; REJECTED's
 * "Duplicate & Edit" opens the duplicate route, which clones it into a new draft before opening
 * that (PMT-014). Both routes are registered in `Permit.router.ts` in the same change as this one
 * — on vue-router 5 an unregistered name throws at render and blanks the page, so this must never
 * ship ahead of the route.
 */
const editRouteName: ComputedRef<'PermitEditPage' | 'PermitDuplicatePage' | undefined> = computed(
  (): 'PermitEditPage' | 'PermitDuplicatePage' | undefined => {
    if (variant.value === 'draft') return 'PermitEditPage'
    if (variant.value === 'rejected') return 'PermitDuplicatePage'
    return undefined
  }
)
</script>

<style scoped>

</style>
