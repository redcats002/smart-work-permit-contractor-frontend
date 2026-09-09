<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div class="min-w-0">
        <RouterLink
          :to="{ name: 'CertificateListPage' }"
          class="text-xs text-text-tertiary hover:text-text-secondary">
          ← {{ t('certificate.detail.backToList') }}
        </RouterLink>
        <h1 class="mt-1 truncate text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ certificate?.workerName ?? t('certificate.detail.title') }}
        </h1>
        <p
          v-if="certificate"
          class="mt-0.5 truncate text-sm text-text-secondary">
          {{ certificate.role }}
        </p>
      </div>
      <Button
        v-if="certificate"
        class="rounded-lg! border-text-primary! bg-text-primary! px-5! text-sm! font-semibold! text-white!
          transition-colors hover:bg-shell-sidebar-hover! hover:border-shell-sidebar-hover!"
        data-test="edit-certificate"
        type="button"
        @click="goToEdit()">
        {{ t('certificate.detail.editButton') }}
      </Button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <Skeleton
        v-if="loading"
        class="rounded-xl!"
        height="18rem" />

      <div
        v-else-if="loadFailed"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg p-4 text-sm text-status-rejected-fg">
        {{ t('certificate.detail.error.loadFailed') }}
      </div>

      <div
        v-else-if="certificate"
        class="flex max-w-2xl flex-col gap-4">
        <div
          :class="style.border"
          class="rounded-[10px] border-[1.5px] bg-surface-card p-4 md:px-[18px]">
          <div class="mb-3 flex items-start justify-between gap-2.5">
            <span class="text-sm font-semibold text-text-primary">{{ t('certificate.detail.title') }}</span>
            <span
              :class="[style.badgeBg, style.badgeFg]"
              class="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-bold whitespace-nowrap"
              data-test="certificate-status">
              {{ t(`certificate.status.${status}`) }}
            </span>
          </div>

          <dl class="rounded-[7px] bg-surface-app px-3 py-2.5 text-[13px]">
            <div class="mb-[5px] flex items-center justify-between gap-2">
              <dt class="text-text-secondary">
                {{ t('certificate.form.field.workerName') }}
              </dt>
              <dd class="truncate font-medium text-text-primary">
                {{ certificate.workerName }}
              </dd>
            </div>
            <div class="mb-[5px] flex items-center justify-between gap-2">
              <dt class="text-text-secondary">
                {{ t('certificate.form.field.role') }}
              </dt>
              <dd class="truncate font-medium text-text-primary">
                {{ certificate.role }}
              </dd>
            </div>
            <div class="mb-[5px] flex items-center justify-between gap-2">
              <dt class="text-text-secondary">
                {{ t('certificate.card.certType') }}
              </dt>
              <dd class="truncate font-medium text-text-primary">
                {{ certificate.certType }}
              </dd>
            </div>
            <div class="mb-[5px] flex items-center justify-between gap-2">
              <dt class="text-text-secondary">
                {{ t('certificate.card.issued') }}
              </dt>
              <dd class="font-mono text-xs text-text-primary">
                {{ issuedLabel }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-2">
              <dt class="text-text-secondary">
                {{ t('certificate.card.expiry') }}
              </dt>
              <dd
                :class="style.expiryText"
                class="font-mono text-xs font-semibold">
                {{ expiryLabel }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="rounded-[10px] border-[1.5px] border-border-input bg-surface-card p-4 md:px-[18px]">
          <p class="mb-2.5 text-sm font-semibold text-text-primary">
            {{ t('certificate.detail.attachment') }}
          </p>

          <Button
            v-if="certificate.filePath"
            :disabled="openingFile"
            class="w-full rounded-lg! text-sm!"
            data-test="open-attachment"
            severity="secondary"
            type="button"
            @click="openAttachment()">
            <span aria-hidden="true">📎</span>
            {{ openingFile ? t('certificate.detail.openingFile') : t('certificate.detail.openFile') }}
          </Button>

          <div
            v-else
            class="flex h-[34px] items-center justify-center gap-1 rounded-[7px] border-[1.5px] border-dashed border-border-input text-[12px] text-text-tertiary">
            <span aria-hidden="true">📎</span>
            <span>{{ t('certificate.card.noFile') }}</span>
          </div>

          <p
            v-if="fileError"
            class="mt-2 text-xs text-status-rejected-fg">
            {{ fileError }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Button from '@/volt/Button.vue'
import Skeleton from 'primevue/skeleton'
import { dayjs } from '@/plugins/dayjs.plugin'
import { useApiError } from '@/composables/useApiError'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import { certificateStatus } from '@/utils/CertificateStatus'

const CertificateService: ICertificateProvider = new CertificateProvider()
const UploadService: IUploadProvider = new UploadProvider()

const { t } = useI18n()
const { mapError } = useApiError()
const route = useRoute()
const router = useRouter()

const certificate = ref<ICertificate | null>(null)
const loading = ref(true)
const loadFailed = ref(false)
const openingFile = ref(false)
const fileError = ref<string | undefined>(undefined)

const certificateId: ComputedRef<number> = computed((): number => Number(route.params.id))

/**
 * The same map `CertificateCard` uses, so a certificate cannot read Valid on one screen and
 * Expiring soon on the other. Duplicated as data rather than imported because the card's copy is
 * private to it and carries a `fileBorder` key this page has no use for — a shared module would
 * have to serve both shapes.
 */
const STATUS_STYLE: Record<ECertificateStatus, {
  border: string
  badgeBg: string
  badgeFg: string
  expiryText: string
}> = {
  [ECertificateStatus.VALID]: {
    border: 'border-status-active-border',
    badgeBg: 'bg-status-active-bg',
    badgeFg: 'text-status-active-fg-emphasis',
    expiryText: 'text-status-active-fg'
  },
  [ECertificateStatus.EXPIRING_SOON]: {
    border: 'border-status-pending-border',
    badgeBg: 'bg-status-pending-bg',
    badgeFg: 'text-status-pending-fg',
    expiryText: 'text-status-pending-fg'
  },
  [ECertificateStatus.EXPIRED]: {
    border: 'border-status-rejected-border',
    badgeBg: 'bg-status-rejected-bg',
    badgeFg: 'text-status-rejected-fg',
    expiryText: 'text-status-rejected-fg'
  }
}

const status: ComputedRef<ECertificateStatus> = computed((): ECertificateStatus => (
  // Server's `expired` decides lapsed; this only layers the advisory "expiring soon" window on
  // top (API-007). Never recompute expiry here — Certificate.model.ts says why.
  certificateStatus(
    certificate.value?.expiryDate ?? '', new Date(), certificate.value?.expired ?? false
  )
))

const style = computed((): typeof STATUS_STYLE[ECertificateStatus] => STATUS_STYLE[status.value])

const issuedLabel: ComputedRef<string> = computed((): string => dayjs(certificate.value?.issuedDate).format('YYYY-MM-DD'))
const expiryLabel: ComputedRef<string> = computed((): string => dayjs(certificate.value?.expiryDate).format('YYYY-MM-DD'))

function goToEdit (): void {
  void router.push({ name: 'CertificateEditPage', params: { id: certificateId.value } })
}

/**
 * Resolves the download at click time rather than holding a URL on the page. The stored value is
 * a storage PATH, and the presigned handle it resolves to expires 60 seconds later — a URL
 * fetched on mount would be dead by the time anyone clicked it.
 */
async function openAttachment (): Promise<void> {
  const filePath = certificate.value?.filePath
  if (!filePath || openingFile.value) return

  openingFile.value = true
  fileError.value = undefined
  try {
    const response = await UploadService.getFileUrl(filePath)
    window.open(response.data.url, '_blank', 'noopener')
  } catch (error: unknown) {
    // Inline, never a toast: the failure belongs next to the button that caused it, and
    // mapError localizes off `errorCode` — the backend's English `message` is never rendered.
    fileError.value = mapError(error).message
  } finally {
    openingFile.value = false
  }
}

async function fetchDetail (): Promise<void> {
  loading.value = true
  loadFailed.value = false
  try {
    const response = await CertificateService.detail(certificateId.value)
    certificate.value = response.data
  } catch {
    // Covers 403 as well as 404: the API scopes this route to the owning contractor, and a
    // directly-typed id belonging to someone else must not render a shell that looks loadable.
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted((): void => {
  void fetchDetail()
})
</script>

<style scoped></style>
