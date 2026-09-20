<template>
  <div class="flex min-h-screen flex-col bg-surface-app">
    <!-- ── Hero ────────────────────────────────────────────────────── -->
    <section class="bg-shell-sidebar px-4 py-14 sm:px-8 md:py-20">
      <div class="mx-auto flex max-w-5xl flex-col items-start gap-5">
        <span class="rounded-full border border-shell-sidebar-divider bg-shell-sidebar-hover px-3 py-1 text-xs font-semibold text-accent-400">
          {{ t('landing.hero.eyebrow') }}
        </span>
        <h1 class="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {{ t('landing.hero.title') }}
        </h1>
        <p class="max-w-2xl text-base text-shell-sidebar-fg sm:text-lg">
          {{ t('landing.hero.subtitle') }}
        </p>
        <div class="flex flex-col items-start gap-2 pt-2">
          <Button
            :label="t('landing.hero.ctaPrimary')"
            @click="router.push({ name: 'LoginPage' })" />
          <span class="text-xs text-shell-sidebar-muted">
            {{ t('landing.hero.ctaNote') }}
          </span>
        </div>
      </div>
    </section>

    <!-- ── Trust strip ─────────────────────────────────────────────── -->
    <section class="border-b border-border bg-surface-card px-4 py-8 sm:px-8">
      <div class="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="fact in trustItems"
          :key="fact.label"
          class="flex flex-col gap-0.5 rounded-lg bg-surface-subtle p-3 text-center">
          <span class="text-xl font-bold text-primary sm:text-2xl">{{ fact.value }}</span>
          <span class="text-xs font-semibold text-text-primary">{{ fact.label }}</span>
          <span class="text-[11px] text-text-secondary">{{ fact.sub }}</span>
        </div>
      </div>
    </section>

    <div class="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-8">
      <!-- ── Value grid ──────────────────────────────────────────────── -->
      <section
        id="why"
        class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-text-primary sm:text-2xl">
          {{ t('landing.features.title') }}
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="feature in featureItems"
            :key="feature.title"
            class="flex flex-col gap-2 rounded-xl border border-border bg-surface-card p-4 md:p-5">
            <h3 class="text-sm font-semibold text-text-primary">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-text-secondary">
              {{ feature.body }}
            </p>
          </div>
        </div>
      </section>

      <!-- ── What contractors can do ────────────────────────────────── -->
      <section
        id="roles"
        class="flex flex-col gap-5 rounded-xl border border-border bg-surface-card p-4 md:p-6">
        <h2 class="text-xl font-bold text-text-primary sm:text-2xl">
          {{ t('landing.capabilities.title') }}
        </h2>
        <ul class="flex flex-col gap-3">
          <li
            v-for="bullet in capabilityItems"
            :key="bullet"
            class="flex items-start gap-2.5 text-sm text-text-secondary">
            <span class="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            {{ bullet }}
          </li>
        </ul>
      </section>

      <!-- ── Permit types ────────────────────────────────────────────── -->
      <section class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-text-primary sm:text-2xl">
          {{ t('landing.permitTypes.title') }}
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="permitType in permitTypeItems"
            :key="permitType.code"
            :class="permitTypeTone(permitType.code)"
            class="flex flex-col gap-2 rounded-xl border p-4">
            <span class="text-sm font-semibold">{{ permitType.label }}</span>
            <span class="text-xs opacity-80">{{ permitType.rule }}</span>
          </div>
        </div>
      </section>

      <!-- ── Lifecycle ────────────────────────────────────────────────── -->
      <section
        id="lifecycle"
        class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-text-primary sm:text-2xl">
          {{ t('landing.lifecycle.title') }}
        </h2>
        <ol class="flex flex-col gap-3">
          <li
            v-for="step in lifecycleItems"
            :key="step.status"
            class="flex flex-col gap-1.5 rounded-xl border border-border bg-surface-card p-4">
            <div class="flex flex-wrap items-center gap-2">
              <span
                :class="statusTone(step.status)"
                class="rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {{ step.label }}
              </span>
              <span class="text-xs text-text-secondary">{{ step.who }}</span>
            </div>
            <p class="text-sm text-text-secondary">
              {{ step.body }}
            </p>
          </li>
        </ol>
      </section>

      <!-- ── Safety gates ─────────────────────────────────────────────── -->
      <section
        id="gates"
        class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-text-primary sm:text-2xl">
          {{ t('landing.gates.title') }}
        </h2>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full min-w-[480px] text-left text-sm">
            <thead class="bg-surface-subtle text-text-secondary">
              <tr>
                <th class="px-3 py-2 font-semibold">
                  {{ gatesColumns.metric }}
                </th>
                <th class="px-3 py-2 font-semibold">
                  {{ gatesColumns.limit }}
                </th>
                <th class="px-3 py-2 font-semibold">
                  {{ gatesColumns.appliesTo }}
                </th>
                <th class="px-3 py-2 font-semibold">
                  {{ gatesColumns.note }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="gate in gateItems"
                :key="gate.metric"
                class="border-t border-border bg-surface-card">
                <td class="px-3 py-2 font-semibold text-text-primary">
                  {{ gate.metric }}
                </td>
                <td class="px-3 py-2 text-text-primary">
                  {{ gate.limit }}
                </td>
                <td class="px-3 py-2 text-text-secondary">
                  {{ gate.appliesTo }}
                </td>
                <td class="px-3 py-2 text-text-secondary">
                  {{ gate.note }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3 rounded-xl bg-primary p-4 text-white md:p-5">
          <h3 class="text-sm font-semibold">
            {{ t('landing.gates.blockersTitle') }}
          </h3>
          <ul class="flex flex-col gap-2">
            <li
              v-for="blocker in blockerItems"
              :key="blocker"
              class="flex items-start gap-2.5 text-sm opacity-90">
              <span aria-hidden="true">⛔</span>
              {{ blocker }}
            </li>
          </ul>
        </div>
      </section>

      <!-- ── Final CTA ────────────────────────────────────────────────── -->
      <section class="flex flex-col items-start gap-3 rounded-xl border border-border bg-shell-sidebar p-6 md:p-8">
        <h2 class="text-xl font-bold text-white sm:text-2xl">
          {{ t('landing.cta.title') }}
        </h2>
        <p class="max-w-xl text-sm text-shell-sidebar-fg">
          {{ t('landing.cta.body') }}
        </p>
        <Button
          :label="t('landing.cta.button')"
          class="mt-1"
          @click="router.push({ name: 'LoginPage' })" />
      </section>
    </div>

    <footer class="border-t border-border bg-surface-card px-4 py-6 text-center text-xs text-text-secondary sm:px-8">
      {{ t('landing.footer.note') }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, type Router } from 'vue-router'

interface ITrustItem {
  value: string
  label: string
  sub: string
}

interface IFeatureItem {
  title: string
  body: string
}

interface IPermitTypeItem {
  code: 'hot' | 'confined' | 'heights'
  label: string
  rule: string
}

interface ILifecycleItem {
  status: 'draft' | 'pending' | 'active' | 'fireMonitor' | 'closed' | 'expired'
  label: string
  who: string
  body: string
}

interface IGateItem {
  metric: string
  limit: string
  appliesTo: string
  note: string
}

const { t } = useI18n()
const router: Router = useRouter()

// Built from individual named t() calls, matching src/pages/guide/pages/GettingStartedPage.vue's
// established convention, rather than reading a stored array out of the locale file via tm().
const trustItems: ComputedRef<ITrustItem[]> = computed((): ITrustItem[] => [
  { value: t('landing.trust.permitTypes.value'), label: t('landing.trust.permitTypes.label'), sub: t('landing.trust.permitTypes.sub') },
  { value: t('landing.trust.statuses.value'), label: t('landing.trust.statuses.label'), sub: t('landing.trust.statuses.sub') },
  { value: t('landing.trust.errorCodes.value'), label: t('landing.trust.errorCodes.label'), sub: t('landing.trust.errorCodes.sub') },
  { value: t('landing.trust.timezone.value'), label: t('landing.trust.timezone.label'), sub: t('landing.trust.timezone.sub') }
])

const featureItems: ComputedRef<IFeatureItem[]> = computed((): IFeatureItem[] => [
  { title: t('landing.features.serverGates.title'), body: t('landing.features.serverGates.body') },
  { title: t('landing.features.auditTrail.title'), body: t('landing.features.auditTrail.body') },
  { title: t('landing.features.offlineInspectors.title'), body: t('landing.features.offlineInspectors.body') },
  { title: t('landing.features.liveQr.title'), body: t('landing.features.liveQr.body') },
  { title: t('landing.features.realFloorPlan.title'), body: t('landing.features.realFloorPlan.body') }
])

const capabilityItems: ComputedRef<string[]> = computed((): string[] => [
  t('landing.capabilities.draftSubmitTrack'),
  t('landing.capabilities.pickPin'),
  t('landing.capabilities.registerWorkers'),
  t('landing.capabilities.requestClosure')
])

const permitTypeItems: ComputedRef<IPermitTypeItem[]> = computed((): IPermitTypeItem[] => [
  { code: 'hot', label: t('landing.permitTypes.hot.label'), rule: t('landing.permitTypes.hot.rule') },
  { code: 'confined', label: t('landing.permitTypes.confined.label'), rule: t('landing.permitTypes.confined.rule') },
  { code: 'heights', label: t('landing.permitTypes.heights.label'), rule: t('landing.permitTypes.heights.rule') }
])

const lifecycleItems: ComputedRef<ILifecycleItem[]> = computed((): ILifecycleItem[] => [
  { status: 'draft', label: t('landing.lifecycle.draft.label'), who: t('landing.lifecycle.draft.who'), body: t('landing.lifecycle.draft.body') },
  { status: 'pending', label: t('landing.lifecycle.pending.label'), who: t('landing.lifecycle.pending.who'), body: t('landing.lifecycle.pending.body') },
  { status: 'active', label: t('landing.lifecycle.active.label'), who: t('landing.lifecycle.active.who'), body: t('landing.lifecycle.active.body') },
  { status: 'fireMonitor', label: t('landing.lifecycle.fireMonitor.label'), who: t('landing.lifecycle.fireMonitor.who'), body: t('landing.lifecycle.fireMonitor.body') },
  { status: 'closed', label: t('landing.lifecycle.closed.label'), who: t('landing.lifecycle.closed.who'), body: t('landing.lifecycle.closed.body') },
  { status: 'expired', label: t('landing.lifecycle.expired.label'), who: t('landing.lifecycle.expired.who'), body: t('landing.lifecycle.expired.body') }
])

const gateItems: ComputedRef<IGateItem[]> = computed((): IGateItem[] => [
  { metric: t('landing.gates.lel.metric'), limit: t('landing.gates.lel.limit'), appliesTo: t('landing.gates.lel.appliesTo'), note: t('landing.gates.lel.note') },
  { metric: t('landing.gates.o2.metric'), limit: t('landing.gates.o2.limit'), appliesTo: t('landing.gates.o2.appliesTo'), note: t('landing.gates.o2.note') },
  { metric: t('landing.gates.co.metric'), limit: t('landing.gates.co.limit'), appliesTo: t('landing.gates.co.appliesTo'), note: t('landing.gates.co.note') },
  { metric: t('landing.gates.wind.metric'), limit: t('landing.gates.wind.limit'), appliesTo: t('landing.gates.wind.appliesTo'), note: t('landing.gates.wind.note') }
])

const blockerItems: ComputedRef<string[]> = computed((): string[] => [
  t('landing.gates.blockerCert'),
  t('landing.gates.blockerFireWatch'),
  t('landing.gates.blockerPin'),
  t('landing.gates.blockerCloseReason')
])

interface IGatesColumns {
  metric: string
  limit: string
  appliesTo: string
  note: string
}

const gatesColumns: ComputedRef<IGatesColumns> = computed((): IGatesColumns => ({
  metric: t('landing.gates.columns.metric'),
  limit: t('landing.gates.columns.limit'),
  appliesTo: t('landing.gates.columns.appliesTo'),
  note: t('landing.gates.columns.note')
}))

// Tone classes reuse this app's own permit-type / status design tokens (AGENTS.md "Design
// system") rather than inventing landing-only colours, so the page looks native to the app a
// visitor is about to sign in to.
function permitTypeTone (code: IPermitTypeItem['code']): string {
  switch (code) {
    case 'hot':
      return 'border-permit-type-hot-fg/30 bg-permit-type-hot-bg text-permit-type-hot-fg'
    case 'confined':
      return 'border-permit-type-confined-fg/30 bg-permit-type-confined-bg text-permit-type-confined-fg'
    case 'heights':
      return 'border-permit-type-heights-fg/30 bg-permit-type-heights-bg text-permit-type-heights-fg'
    default:
      return ''
  }
}

function statusTone (status: ILifecycleItem['status']): string {
  switch (status) {
    case 'draft':
      return 'border-border-strong bg-status-draft-bg text-status-draft-fg'
    case 'pending':
      return 'border-status-pending-border bg-status-pending-bg text-status-pending-fg'
    case 'active':
      return 'border-status-active-border bg-status-active-bg text-status-active-fg'
    case 'fireMonitor':
      return 'border-status-fire-monitor-border bg-status-fire-monitor-bg text-status-fire-monitor-fg'
    case 'closed':
      return 'border-border-strong bg-status-closed-bg text-status-closed-fg'
    case 'expired':
      return 'border-border-strong bg-status-expired-bg text-status-expired-fg'
    default:
      return ''
  }
}
</script>

<style scoped></style>
