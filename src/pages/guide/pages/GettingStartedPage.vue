<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('guide.header.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('guide.header.subtitle') }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-5 px-4 py-6 md:px-8">
      <!-- wayfinder 077 — every <section>/inner block below carries an `id` a route hash can
           target (see `scrollToHash`). Keep every new id in sync with the anchors this page's
           own content, and any in-app link into it (Step3WhereWhen's "what is this for?"), use. -->
      <section
        id="overview"
        :class="sectionClass('overview')"
        class="flex flex-col gap-3 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.overview.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.overview.intro') }}
        </p>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li
            v-for="mod in overviewModules"
            :key="mod.key"
            class="rounded-lg bg-surface-subtle p-3">
            <p class="text-sm font-semibold text-text-primary">
              {{ mod.title }}
            </p>
            <p class="mt-1 text-xs text-text-secondary">
              {{ mod.desc }}
            </p>
          </li>
        </ul>
      </section>

      <section
        id="wizard"
        :class="sectionClass('wizard')"
        class="flex flex-col gap-3 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.wizard.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.wizard.intro') }}
        </p>
        <ol class="flex flex-col gap-2.5">
          <li
            v-for="step in wizardSteps"
            :key="step.key"
            class="rounded-lg bg-surface-subtle p-3">
            <p class="text-sm font-semibold text-text-primary">
              {{ step.title }}
            </p>
            <p class="mt-1 text-xs text-text-secondary">
              {{ step.desc }}
            </p>
          </li>
        </ol>

        <!-- wayfinder 077 — the "what is an area for?" answer, linked from Step3WhereWhen's area
             picker (034/070's shipped area/pin semantics, restated here, not redesigned). -->
        <div
          id="area"
          :class="sectionClass('area')"
          class="rounded-lg border border-accent/30 bg-accent-50 p-4 transition-shadow">
          <h3 class="text-sm font-bold text-text-primary">
            {{ t('guide.area.title') }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">
            {{ t('guide.area.p1') }}
          </p>
          <p class="mt-2 text-sm text-text-secondary">
            {{ t('guide.area.p2') }}
          </p>
          <p class="mt-2 text-sm text-text-secondary">
            {{ t('guide.area.p3') }}
          </p>
        </div>
      </section>

      <section
        id="permit-detail"
        :class="sectionClass('permit-detail')"
        class="flex flex-col gap-2 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.permitDetail.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.permitDetail.p1') }}
        </p>
        <p class="text-sm text-text-secondary">
          {{ t('guide.permitDetail.p2') }}
        </p>
      </section>

      <section
        id="history"
        :class="sectionClass('history')"
        class="flex flex-col gap-2 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.history.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.history.p1') }}
        </p>
      </section>

      <section
        id="certificates"
        :class="sectionClass('certificates')"
        class="flex flex-col gap-2 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.certificates.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.certificates.p1') }}
        </p>
      </section>

      <section
        id="workers"
        :class="sectionClass('workers')"
        class="flex flex-col gap-2 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.workers.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.workers.p1') }}
        </p>
      </section>

      <section
        id="profile"
        :class="sectionClass('profile')"
        class="flex flex-col gap-2 rounded-xl border p-4 md:p-5">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ t('guide.profile.title') }}
        </h2>
        <p class="text-sm text-text-secondary">
          {{ t('guide.profile.p1') }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

interface INamedBlock {
  key: string
  title: string
  desc: string
}

const { t } = useI18n()
const route = useRoute()

const overviewModules: ComputedRef<INamedBlock[]> = computed((): INamedBlock[] => [
  { key: 'permits', title: t('guide.overview.modules.permits.title'), desc: t('guide.overview.modules.permits.desc') },
  { key: 'newPermit', title: t('guide.overview.modules.newPermit.title'), desc: t('guide.overview.modules.newPermit.desc') },
  { key: 'history', title: t('guide.overview.modules.history.title'), desc: t('guide.overview.modules.history.desc') },
  { key: 'certificates', title: t('guide.overview.modules.certificates.title'), desc: t('guide.overview.modules.certificates.desc') },
  { key: 'workers', title: t('guide.overview.modules.workers.title'), desc: t('guide.overview.modules.workers.desc') }
])

const wizardSteps: ComputedRef<INamedBlock[]> = computed((): INamedBlock[] => [
  { key: 'type', title: t('guide.wizard.steps.type.title'), desc: t('guide.wizard.steps.type.desc') },
  { key: 'basicInfo', title: t('guide.wizard.steps.basicInfo.title'), desc: t('guide.wizard.steps.basicInfo.desc') },
  { key: 'whereWhen', title: t('guide.wizard.steps.whereWhen.title'), desc: t('guide.wizard.steps.whereWhen.desc') },
  { key: 'safetyChecks', title: t('guide.wizard.steps.safetyChecks.title'), desc: t('guide.wizard.steps.safetyChecks.desc') },
  { key: 'ppeWorkers', title: t('guide.wizard.steps.ppeWorkers.title'), desc: t('guide.wizard.steps.ppeWorkers.desc') },
  { key: 'jsa', title: t('guide.wizard.steps.jsa.title'), desc: t('guide.wizard.steps.jsa.desc') },
  { key: 'review', title: t('guide.wizard.steps.review.title'), desc: t('guide.wizard.steps.review.desc') }
])

/**
 * wayfinder 077 — which section id (if any) was just scrolled to via a route hash, so it can
 * carry a brief highlight ring. Cleared after `HIGHLIGHT_MS` — this is a courtesy, not a tour: no
 * DOM selector is depended on, only element ids this page owns and renders unconditionally.
 */
const HIGHLIGHT_MS = 2000
const highlightedId: Ref<string | null> = ref(null)
let highlightTimeout: ReturnType<typeof setTimeout> | undefined

function sectionClass (id: string): string {
  return highlightedId.value === id
    ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-surface-app'
    : 'border-border'
}

function scrollToHash (hash: string): void {
  const id = hash.replace('#', '')
  if (!id) return
  void nextTick((): void => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    highlightedId.value = id
    if (highlightTimeout) clearTimeout(highlightTimeout)
    highlightTimeout = setTimeout((): void => {
      highlightedId.value = null
    }, HIGHLIGHT_MS)
  })
}

onMounted((): void => {
  if (route.hash) scrollToHash(route.hash)
})

// A same-page navigation (Step3WhereWhen's link uses the same route name, only the hash differs)
// does not remount this component — vue-router updates `route.hash` in place, so re-scrolling has
// to be driven by a watcher, not only the mount hook above.
watch((): string => route.hash, (hash: string): void => {
  if (hash) scrollToHash(hash)
})
</script>

<style scoped>

</style>
