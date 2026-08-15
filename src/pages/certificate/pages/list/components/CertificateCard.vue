<template>
  <div
    :class="style.border"
    class="min-w-0 rounded-[10px] border-[1.5px] bg-surface-card p-4 md:px-[18px]">
    <div class="mb-2.5 flex items-start justify-between gap-2.5">
      <div class="min-w-0">
        <p class="truncate text-[15px] font-semibold text-text-primary">
          {{ certificate.workerName }}
        </p>
        <p class="mt-0.5 truncate text-xs text-text-tertiary">
          {{ certificate.role }}
        </p>
      </div>
      <span
        :class="[style.badgeBg, style.badgeFg]"
        class="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-bold whitespace-nowrap">
        {{ t(`certificate.status.${status}`) }}
      </span>
    </div>

    <div class="rounded-[7px] bg-surface-app px-3 py-2.5 text-[12.5px]">
      <div class="mb-[5px] flex items-center justify-between gap-2">
        <span class="text-text-secondary">{{ t('certificate.card.certType') }}</span>
        <span class="truncate font-medium text-text-primary">{{ certificate.certType }}</span>
      </div>
      <div class="mb-[5px] flex items-center justify-between gap-2">
        <span class="text-text-secondary">{{ t('certificate.card.issued') }}</span>
        <span class="font-mono text-[11.5px] text-text-primary">{{ issuedLabel }}</span>
      </div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-text-secondary">{{ t('certificate.card.expiry') }}</span>
        <span
          :class="style.expiryText"
          class="font-mono text-[11.5px] font-semibold">
          {{ expiryLabel }}
        </span>
      </div>
    </div>

    <div
      :class="style.fileBorder"
      class="mt-2.5 flex h-[34px] items-center justify-center gap-1 rounded-[7px] border-[1.5px] border-dashed text-[11.5px] text-text-tertiary">
      <span aria-hidden="true">📎</span>
      <span class="truncate">{{ certificate.fileRef ?? t('certificate.card.noFile') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import { certificateStatus } from '@/utils/CertificateStatus'

interface IProps {
  certificate: ICertificate
}

const props = defineProps<IProps>()

const { t } = useI18n()

/**
 * Single source of truth for validity — card border, badge, and expiry-date color
 * all key off this one map, never re-derived with separate ternaries per element.
 */
const STATUS_STYLE: Record<ECertificateStatus, {
  border: string
  badgeBg: string
  badgeFg: string
  expiryText: string
  fileBorder: string
}> = {
  [ECertificateStatus.VALID]: {
    border: 'border-status-active-border',
    badgeBg: 'bg-status-active-bg',
    badgeFg: 'text-status-active-fg-emphasis',
    expiryText: 'text-status-active-fg',
    fileBorder: 'border-border-input'
  },
  [ECertificateStatus.EXPIRING_SOON]: {
    border: 'border-status-pending-border',
    badgeBg: 'bg-status-pending-bg',
    badgeFg: 'text-status-pending-fg',
    expiryText: 'text-status-pending-fg',
    fileBorder: 'border-status-pending-border'
  },
  [ECertificateStatus.EXPIRED]: {
    border: 'border-status-rejected-border',
    badgeBg: 'bg-status-rejected-bg',
    badgeFg: 'text-status-rejected-fg',
    expiryText: 'text-status-rejected-fg',
    fileBorder: 'border-status-rejected-border'
  }
}

const status: ComputedRef<ECertificateStatus> = computed((): ECertificateStatus => (
  certificateStatus(props.certificate.expiryDate, new Date())
))

const style = computed((): typeof STATUS_STYLE[ECertificateStatus] => STATUS_STYLE[status.value])

const issuedLabel: ComputedRef<string> = computed((): string => dayjs(props.certificate.issuedDate).format('YYYY-MM-DD'))
const expiryLabel: ComputedRef<string> = computed((): string => dayjs(props.certificate.expiryDate).format('YYYY-MM-DD'))
</script>

<style scoped>

</style>
