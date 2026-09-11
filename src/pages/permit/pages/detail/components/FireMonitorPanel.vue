<template>
  <section
    class="mt-4.5 rounded-[14px] bg-accent px-6.5 py-6 text-white"
    data-test="fire-monitor-panel">
    <p class="mb-1.5 text-[11.5px] font-bold tracking-[1.5px] opacity-90">
      {{ t('permit.detail.fireMonitor.heading') }}
    </p>

    <p class="my-1.5 flex flex-wrap items-baseline gap-2">
      <span
        class="font-mono text-[80px] leading-none font-bold tracking-[-3px]"
        data-test="fire-monitor-countdown">
        {{ remaining }}
      </span>
      <span class="text-base opacity-80">
        {{ t('permit.detail.fireMonitor.remaining') }}
      </span>
    </p>

    <div class="mb-4 h-1.75 rounded bg-black/20">
      <div
        :style="{ width: `${elapsedPercent}%` }"
        class="h-1.75 rounded bg-white/90 transition-[width] duration-1000 ease-linear" />
    </div>

    <p class="mb-3.5 rounded-[10px] bg-black/15 px-3.5 py-2.75 text-[13px] leading-relaxed">
      ⚠ {{ t('permit.detail.fireMonitor.warning') }}
    </p>

    <button
      class="h-12.5 w-full cursor-pointer rounded-[10px] bg-status-active-fg text-[15px] font-bold text-white hover:bg-status-active-fg-emphasis"
      data-test="fire-monitor-close"
      type="button"
      @click="emits('close')">
      {{ t('permit.detail.fireMonitor.close') }}
    </button>
    <p
      v-if="running"
      class="mt-2.5 text-center text-[12px] leading-snug opacity-80"
      data-test="fire-monitor-request-note">
      {{ t('permit.detail.fireMonitor.requestWhileRunning', { remaining }) }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import useFireWatch from '@/pages/permit/pages/detail/composables/useFireWatch'
import type { IPermitFireWatch } from '@/models/modules/permit/Permit.model'

interface IProps {
  /** The SERVER's computed Fire Watch state. The countdown is anchored to it, never to mount time. */
  fireWatch: IPermitFireWatch | null
}

interface IEmits {
  /** Opens `RequestCloseModal`, not an actual close — see wayfinder 098's note below. */
  close: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const { t } = useI18n()

const fireWatch: ComputedRef<IPermitFireWatch | null> = computed((): IPermitFireWatch | null => props.fireWatch)

/**
 * Design lines 560-570. The GPS-tagged-photo sub-flow the design puts between "timer ends" and
 * "Close Permit" is deliberately absent — no endpoint models it (PMT-012 scope note).
 *
 * wayfinder 098 (reopened 2026-09-11) — the button below used to LOCK until `running` went
 * false, because it used to trigger an actual `POST /permits/:id/close`, which Hot Work answers
 * `403 FIRE_WATCH_NOT_ELAPSED` for until the countdown ends. It now opens `RequestCloseModal`
 * instead, and `POST /permits/:id/close-request` (close-request.service.ts on the api side) has
 * no such gate — it accepts ACTIVE *or* FIRE_MONITOR unconditionally. Locking the button here
 * would invent a restriction the api does not have, so it stays clickable for the whole
 * countdown; the note below only sets the expectation that Safety still cannot act on it yet.
 */
const { remaining, elapsedPercent, running } = useFireWatch(fireWatch)
</script>

<style scoped>

</style>
