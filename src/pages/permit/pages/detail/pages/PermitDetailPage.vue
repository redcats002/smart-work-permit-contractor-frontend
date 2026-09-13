<template>
  <div class="px-4 py-5 md:px-7.5 md:py-6">
    <button
      class="mb-3 cursor-pointer border-none bg-transparent p-0 text-[13px] text-text-secondary hover:text-text-primary"
      type="button"
      @click="router.push({ name: 'PermitListPage' })">
      ← {{ t('permit.detail.back') }}
    </button>

    <div
      v-if="loading"
      class="flex flex-col gap-4">
      <Skeleton
        class="rounded-xl!"
        height="4.5rem" />
      <Skeleton
        class="rounded-xl!"
        height="18rem" />
    </div>

    <div
      v-else-if="!permit"
      class="rounded-xl border border-border bg-surface-card px-5 py-10 text-center"
      data-test="detail-error">
      <p class="text-sm font-semibold text-text-primary">
        {{ t('permit.detail.notFound') }}
      </p>
      <p class="mt-1 text-[13px] text-text-secondary">
        {{ loadError }}
      </p>
    </div>

    <template v-else>
      <div class="print:hidden">
        <PermitStatusBanner
          :just-submitted="justSubmitted"
          :permit="permit"
          :rejected-by="rejectedBy">
          <template
            v-if="canRunClosure || canMarkComplete"
            #action>
            <button
              v-if="canMarkComplete"
              class="inline-flex h-11 cursor-pointer items-center justify-center rounded-[9px] bg-accent-emphasis px-5 text-[13.5px]
                font-bold whitespace-nowrap text-white hover:bg-accent-emphasis-alt"
              data-test="start-mark-complete"
              type="button"
              @click="showMarkComplete = true">
              {{ t('permit.detail.closure.start') }}
            </button>
            <button
              v-else
              class="inline-flex h-11 cursor-pointer items-center justify-center rounded-[9px] bg-status-active-fg px-5 text-[13.5px]
                font-bold whitespace-nowrap text-white hover:bg-status-active-fg-emphasis"
              data-test="start-closure"
              type="button"
              @click="showRequestClose = true">
              {{ isCloseRequestedAwaitingSafety ? t('permit.detail.requestClose.again') : t('permit.detail.requestClose.start') }}
            </button>
          </template>
        </PermitStatusBanner>

        <!--
          wayfinder 113 / ruling 11 — urgent and notification-related state stays a FIXED section
          above the tabs, reachable with zero interaction. Renders nothing (see
          PermitUrgentSection.vue) when there is nothing urgent, so the common case is this page's
          own status banner immediately followed by the clean tabbed layout below.
        -->
        <PermitUrgentSection :permit="permit" />
      </div>

      <!--
        268px right rail. `lg:flex-row` puts the rail beside the main column on wide screens and
        stacks it BELOW the main column at narrow widths (flex-col + the rail declared second).
        `print:hidden` — the full-permit print/export (PermitPrintLayout.vue below) replaces this
        whole on-screen viewing area with its own paper-formatted content when printing.
      -->
      <div class="flex flex-col gap-5.5 lg:flex-row print:hidden">
        <div class="min-w-0 flex-1">
          <div class="mb-1.5 flex flex-wrap items-center gap-2.75">
            <span
              :class="[typeChipClass.bg, typeChipClass.fg]"
              class="rounded-md px-2.5 py-1 text-[11.5px] font-semibold">
              {{ t(`permit.type.${permit.type}`) }}
            </span>
            <span
              :class="[statusClass.bg, statusClass.fg]"
              class="inline-flex items-center gap-1 rounded-full px-2.75 py-1 text-[11px] font-semibold">
              <PermitStatusGlyph :status="permit.status" />
              {{ t(`permit.status.${permit.status}`) }}
            </span>
          </div>

          <h1 class="text-[23px] font-bold tracking-tight text-text-primary break-words">
            {{ permit.title }}
          </h1>
          <p class="mb-3 font-mono text-[12.5px] text-text-tertiary break-words">
            {{ permit.id }}
          </p>

          <!-- 2026-09-12 owner-filed issue 2 — full-permit print/export. Page-level (not a tab): covers every tab's content at once. -->
          <PermitPrintLayout
            :audit="audit"
            :permit="permit"
            class="mb-4" />

          <!--
            wayfinder 113 — the six sections of docs/main/dev-handoff/05-permit-detail-sections.md
            §2, now tabbed rather than stacked (narrows 052's convention). Each is already its own
            component with its own props; this only changes how they are switched between. Volt
            `TabPanel` keeps every panel mounted and toggles visibility with `v-show` unless the
            parent sets `lazy` (see src/volt/TabPanel.vue) — deliberately not set, so switching
            tabs never re-fetches or re-mounts a section. `show-navigators` stays off: the strip's
            own `overflow-x-auto` (src/volt/TabList.vue) already keeps a 6-tab strip scrolling
            inside itself at the 375px floor, and the prev/next buttons carry a `v-ripple` this
            app never registers.
          -->
          <Tabs v-model:value="activeTab">
            <TabList>
              <Tab
                v-for="item in tabItems"
                :key="item.value"
                :value="item.value">
                {{ item.label }}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="overview">
                <PermitDetailSection
                  :title="t('permit.detail.sections.overview.title')"
                  name="overview">
                  <PermitInfoCard :permit="permit" />
                </PermitDetailSection>
              </TabPanel>

              <!--
                §2 owns its own empty state rather than delegating to the wrapper: the
                outdoor-work bypass explanation and the server verdict must still render on a
                permit that has no reading recorded yet, which is exactly the DRAFT case.
              -->
              <TabPanel value="safety">
                <PermitDetailSection
                  :title="t('permit.detail.sections.safety.title')"
                  name="safety">
                  <PermitSafetySection :permit="permit" />
                </PermitDetailSection>
              </TabPanel>

              <TabPanel value="workers">
                <PermitDetailSection
                  :title="t('permit.detail.sections.workers.title')"
                  name="workers">
                  <PermitWorkersSection :permit="permit" />
                </PermitDetailSection>
              </TabPanel>

              <TabPanel value="jsa">
                <PermitDetailSection
                  :empty="permit.jsaSteps.length === 0"
                  :empty-text="t('permit.detail.sections.jsa.empty')"
                  :title="t('permit.detail.sections.jsa.title')"
                  name="jsa">
                  <PermitJsaSection :steps="permit.jsaSteps" />
                </PermitDetailSection>
              </TabPanel>

              <TabPanel value="closure">
                <PermitDetailSection
                  :title="closureSectionTitle"
                  name="closure">
                  <PermitClosureSection
                    :fire-watch-remaining="fireWatchRemaining"
                    :permit="permit" />
                </PermitDetailSection>
              </TabPanel>

              <TabPanel value="audit">
                <PermitDetailSection
                  :title="t('permit.detail.sections.audit.title')"
                  name="audit">
                  <PermitAuditTimeline :entries="audit" />
                </PermitDetailSection>
              </TabPanel>

              <!-- wayfinder 112 — the seventh tab. Self-contained: fetches its own report data, reads `audit` as a prop. -->
              <TabPanel value="report">
                <PermitDetailSection
                  :title="t('permit.detail.sections.report.title')"
                  name="report">
                  <PermitReportSection
                    :audit="audit"
                    :permit="permit" />
                </PermitDetailSection>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        <aside class="w-full shrink-0 lg:w-67">
          <PermitQrPanel :token="qrToken" />
        </aside>
      </div>

      <FireMonitorPanel
        v-if="permit.status === 'FIRE_MONITOR'"
        :fire-watch="permit.fireWatch"
        class="print:hidden"
        @close="showRequestClose = true" />
    </template>

    <MarkCompleteConfirmModal
      v-if="permit"
      v-model="showMarkComplete"
      :permit-id="permit.id"
      @completed="onPermitUpdated($event)" />

    <RequestCloseModal
      v-if="permit"
      v-model="showRequestClose"
      :permit="permit"
      @requested="onPermitUpdated($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitAuditEntry, IPermitFireWatch } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitStatusGlyph from '@/components/chip/PermitStatusGlyph.vue'
import useTabItems, { type ITabItemComponent, type IUseTabItems } from '@/composables/useTabItems'
import FireMonitorPanel from '@/pages/permit/pages/detail/components/FireMonitorPanel.vue'
import MarkCompleteConfirmModal from '@/pages/permit/pages/detail/components/MarkCompleteConfirmModal.vue'
import PermitAuditTimeline from '@/pages/permit/pages/detail/components/PermitAuditTimeline.vue'
import PermitClosureSection from '@/pages/permit/pages/detail/components/PermitClosureSection.vue'
import PermitDetailSection from '@/pages/permit/pages/detail/components/PermitDetailSection.vue'
import PermitInfoCard from '@/pages/permit/pages/detail/components/PermitInfoCard.vue'
import PermitJsaSection from '@/pages/permit/pages/detail/components/PermitJsaSection.vue'
import PermitPrintLayout from '@/pages/permit/pages/detail/components/PermitPrintLayout.vue'
import PermitQrPanel from '@/pages/permit/pages/detail/components/PermitQrPanel.vue'
import PermitReportSection from '@/pages/permit/pages/detail/components/PermitReportSection.vue'
import PermitSafetySection from '@/pages/permit/pages/detail/components/PermitSafetySection.vue'
import PermitStatusBanner from '@/pages/permit/pages/detail/components/PermitStatusBanner.vue'
import PermitUrgentSection from '@/pages/permit/pages/detail/components/PermitUrgentSection.vue'
import PermitWorkersSection from '@/pages/permit/pages/detail/components/PermitWorkersSection.vue'
import RequestCloseModal from '@/pages/permit/pages/detail/components/RequestCloseModal.vue'
import useFireWatch from '@/pages/permit/pages/detail/composables/useFireWatch'
import usePermitDetail from '@/pages/permit/pages/detail/composables/usePermitDetail'

/**
 * PMT-010 — Permit Detail. Design lines 430-505.
 *
 * Read-only by construction: this screen renders the permit, its append-only audit trail and its
 * QR token. It offers no path to edit or delete an audit entry, and the backend serves none.
 */
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const permitId: string = String(route.params.id ?? '')

const { permit, audit, qrToken, loading, loadError, fetchDetail, applyPermit } = usePermitDetail(permitId)

const showRequestClose: Ref<boolean> = ref(false)
const showMarkComplete: Ref<boolean> = ref(false)

const fireWatch: ComputedRef<IPermitFireWatch | null> = computed((): IPermitFireWatch | null => permit.value?.fireWatch ?? null)
const { remaining: fireWatchRemaining } = useFireWatch(fireWatch)

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

const typeChipClass: ComputedRef<{ bg: string, fg: string }> = computed(
  (): { bg: string, fg: string } => TYPE_CHIP_CLASS[permit.value?.type ?? 'hot'])

/**
 * wayfinder ticket 047. §5 keeps its "& Fire Watch" half only on a hot-work permit, because that
 * is the only type whose section can ever contain one — `PermitClosureSection` renders no Fire
 * Watch block at all otherwise, and a heading naming a region that is not on the page is worse
 * than the empty region it replaced.
 */
const closureSectionTitle: ComputedRef<string> = computed((): string => (
  permit.value?.type === 'hot'
    ? t('permit.detail.sections.closure.title')
    : t('permit.detail.sections.closure.titleClosureOnly')
))

const statusClass: ComputedRef<{ bg: string, fg: string }> = computed(
  (): { bg: string, fg: string } => STATUS_CLASS[permit.value?.status ?? 'DRAFT'])

/**
 * wayfinder 113 — the tab list this page switches between, built with the composable the ticket
 * names. `useTabItems` seeds the initial active tab from `?tab=` and never writes back on its
 * own; the watcher below adds that, spreading the existing query rather than replacing it whole
 * (the dead `src/components/base/BaseTab.vue`'s `router.replace({ query: { tab } })` drops every
 * other param a page holds — e.g. this page's own `?submitted=1` — which is exactly what ticket
 * 052 flagged and this composition avoids).
 *
 * `BaseTabWindow` is deliberately NOT used to render the active panel: it mounts only the ONE
 * active tab's component (`src/composables/useTabItems.ts`'s `importComponent` wraps it in
 * `defineAsyncComponent`), so switching tabs would defer a section's first fetch/render until its
 * tab opens — a mount-timing change the "behaviour must not change" rule forbids. The panels
 * above use Volt's `TabPanel` instead (src/volt/TabPanel.vue), which keeps every section mounted
 * and toggles visibility with `v-show`.
 */
const tabDefs: ComputedRef<ITabItemComponent[]> = computed((): ITabItemComponent[] => [
  { label: t('permit.detail.sections.overview.title'), value: 'overview' },
  { label: t('permit.detail.sections.safety.title'), value: 'safety' },
  { label: t('permit.detail.sections.workers.title'), value: 'workers' },
  { label: t('permit.detail.sections.jsa.title'), value: 'jsa' },
  { label: closureSectionTitle.value, value: 'closure' },
  { label: t('permit.detail.sections.audit.title'), value: 'audit' },
  { label: t('permit.detail.sections.report.title'), value: 'report' }
])

const { tab: activeTab, tabItems }: IUseTabItems = useTabItems(tabDefs)

watch(activeTab, (value: string): void => {
  void router.replace({ query: { ...route.query, tab: value } })
})

/**
 * `?submitted=1` — set by whoever navigates here straight after a successful submit. It is a
 * client-side hint, never a wire field; the banner falls back to no banner without it.
 */
const justSubmitted: ComputedRef<boolean> = computed((): boolean => route.query.submitted === '1')

/** The rejecting officer exists only in the audit trail — the permit payload has no `rejectedBy`. */
const rejectedBy: ComputedRef<string> = computed((): string => {
  const entry = audit.value.find((row: IPermitAuditEntry): boolean => row.action === 'PERMIT_REJECTED')
  return permitAuthorName(entry?.actor)
})

/**
 * Confined Space and Working at Heights close straight from ACTIVE. Hot Work cannot: the backend
 * requires it to pass through FIRE_MONITOR first (403 `PERMIT_NOT_CLOSABLE` otherwise), which is
 * the mark-complete path in `PMT-012`.
 */
const canRunClosure: ComputedRef<boolean> = computed((): boolean =>
  permit.value?.status === 'ACTIVE' && permit.value.type !== 'hot')

/** Hot Work only — ACTIVE → FIRE_MONITOR starts the mandatory server-side Fire Watch. */
const canMarkComplete: ComputedRef<boolean> = computed((): boolean =>
  permit.value?.status === 'ACTIVE' && permit.value.type === 'hot')

/**
 * wayfinder 098 (reopened 2026-09-11) — same "awaiting Safety" gate `PermitUrgentSection.vue`
 * uses: `closeRequestedAt` is set once and never cleared, so it only still means something while
 * the permit is ACTIVE/FIRE_MONITOR. Drives the request button's label between "Request Closure"
 * and "Update Request" — re-sending is a deliberate, idempotent no-op on the api side, not a
 * conflict, so there is no "already requested" lockout here.
 */
const isCloseRequestedAwaitingSafety: ComputedRef<boolean> = computed((): boolean =>
  Boolean(permit.value?.closeRequestedAt)
  && (permit.value?.status === 'ACTIVE' || permit.value?.status === 'FIRE_MONITOR'))

async function onPermitUpdated (updated: IPermitDetail): Promise<void> {
  showRequestClose.value = false
  showMarkComplete.value = false
  await applyPermit(updated)
}

onMounted((): void => {
  void fetchDetail()
})
</script>

<style scoped>

</style>
