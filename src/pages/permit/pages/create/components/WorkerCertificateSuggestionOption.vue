<template>
  <!--
    wayfinder ticket 048. Volt's AutoComplete option is `whitespace-nowrap overflow-hidden`, and
    that inherits: an over-long name was CLIPPED mid-word with no ellipsis and no other signal it
    had been cut. The name is the field being searched, so it is the half that must never be cut —
    it wraps instead (`whitespace-normal break-words`), and the row grows a line. The metadata
    line is the stated degradation: `certType · expiry` ellipsizes if it has to, and its expired
    marker keeps ticket 004's `text-status-rejected-fg` weight either way.
  -->
  <div class="flex w-full min-w-0 flex-col gap-0.5 py-0.5">
    <span class="text-sm font-medium break-words whitespace-normal text-text-primary">{{ certificate.workerName }}</span>
    <span
      :class="certificate.expired ? 'font-semibold text-status-rejected-fg' : 'text-text-secondary'"
      class="truncate text-xs">
      {{ certificate.certType }} · {{ expiryLabel }}
      <template v-if="certificate.expired">
        · {{ t('permit.create.steps.ppeWorkers.suggestion.expired') }}
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'

/**
 * wayfinder ticket 004 — one row of the worker-name AutoComplete's suggestion list (step 4). A
 * separate presentational component so this rendering (and the expired mark specifically) is
 * unit-testable without going through PrimeVue AutoComplete's own overlay/Portal machinery.
 *
 * Never recomputes expiry — `certificate.expired` is the backend-computed verdict
 * (src/utils/CertificateStatus.ts), mirroring `CertificateCard.vue`'s danger-status pattern
 * (`text-status-rejected-fg`) for the expired case.
 */
interface IProps {
  certificate: ICertificate
}

const props = defineProps<IProps>()
const { t } = useI18n()

const expiryLabel: ComputedRef<string> = computed((): string => dayjs(props.certificate.expiryDate).format('YYYY-MM-DD'))
</script>

<style scoped>
</style>
