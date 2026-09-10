<template>
  <div class="rounded-[10px] border-[1.5px] border-border-input bg-surface-card p-4 md:px-[18px]">
    <div class="mb-3 flex items-center justify-between gap-2.5">
      <h2 class="text-sm font-semibold text-text-primary">
        {{ t('worker.detail.sectionCertificates') }}
      </h2>
      <button
        class="rounded-md border border-border-strong bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary"
        data-test="worker-add-certificate"
        type="button"
        @click="emit('add')">
        <span aria-hidden="true">📎</span> {{ t('worker.detail.addCertificate') }}
      </button>
    </div>

    <p
      v-if="!certificates.length"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
      data-test="worker-certificates-empty">
      {{ t('worker.detail.certificatesEmpty') }}
    </p>

    <ul
      v-else
      class="flex flex-col gap-2"
      data-test="worker-certificates-list">
      <li
        v-for="certificate in certificates"
        :key="certificate.id">
        <RouterLink
          :to="{ name: 'CertificateDetailPage', params: { id: certificate.id } }"
          class="flex items-center justify-between gap-2.5 rounded-[9px] border border-border bg-surface-app px-3.5 py-2.5
            text-[13px] transition-colors hover:bg-surface-subtle">
          <span class="truncate font-medium text-text-primary">{{ certificate.certType }}</span>
          <span
            :class="[style(certificate).badgeBg, style(certificate).badgeFg]"
            class="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-bold whitespace-nowrap">
            {{ t(`certificate.status.${status(certificate)}`) }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { IWorkerDetailCertificate } from '@/models/modules/worker/Worker.model'
import { certificateStatus } from '@/utils/CertificateStatus'

/**
 * wayfinder 062 — "certificates, each with its status and its attachment, linking to 057's
 * detail page." Reuses `CertificateStatus.ts`'s vocabulary/thresholds — never a second one.
 */
interface IProps {
  certificates: IWorkerDetailCertificate[]
}

interface IEmits {
  add: []
}

defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()

const STATUS_STYLE: Record<ECertificateStatus, { badgeBg: string, badgeFg: string }> = {
  [ECertificateStatus.VALID]: { badgeBg: 'bg-status-active-bg', badgeFg: 'text-status-active-fg-emphasis' },
  [ECertificateStatus.EXPIRING_SOON]: { badgeBg: 'bg-status-pending-bg', badgeFg: 'text-status-pending-fg' },
  [ECertificateStatus.EXPIRED]: { badgeBg: 'bg-status-rejected-bg', badgeFg: 'text-status-rejected-fg' }
}

function status (certificate: IWorkerDetailCertificate): ECertificateStatus {
  return certificateStatus(certificate.expiryDate, new Date(), certificate.expired)
}

function style (certificate: IWorkerDetailCertificate): { badgeBg: string, badgeFg: string } {
  return STATUS_STYLE[status(certificate)]
}
</script>

<style scoped></style>
