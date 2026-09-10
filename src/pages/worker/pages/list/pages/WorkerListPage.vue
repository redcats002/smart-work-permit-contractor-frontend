<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('worker.list.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('worker.list.subtitle') }}
        </p>
      </div>
      <Button
        class="rounded-lg! border-text-primary! bg-text-primary! px-5! text-sm! font-semibold! text-white!
          transition-colors hover:bg-shell-sidebar-hover! hover:border-shell-sidebar-hover!"
        data-test="register-worker-open"
        type="button"
        @click="registerOpen = true">
        <span aria-hidden="true">＋</span>
        {{ t('worker.list.addButton') }}
      </Button>
    </div>

    <div class="px-4 py-6 md:px-8">
      <InputText
        v-model="search"
        :placeholder="t('worker.list.searchPlaceholder')"
        class="mb-3.5 w-full max-w-sm" />

      <div
        v-if="loading"
        class="flex flex-col gap-2">
        <Skeleton
          v-for="n in 5"
          :key="n"
          class="rounded-lg!"
          height="3.25rem" />
      </div>

      <Empty
        v-else-if="isEmpty"
        :description="t('worker.list.empty.description')"
        :title="t('worker.list.empty.title')" />

      <template v-else>
        <div
          class="overflow-x-auto rounded-[11px] border border-border bg-surface-card"
          data-test="worker-table">
          <div class="min-w-[560px]">
            <div
              class="grid grid-cols-[1fr_170px_170px_90px] gap-2 bg-surface-subtle px-3.5 py-2.5
              text-[10.5px] font-semibold tracking-wide text-text-secondary">
              <div>{{ t('worker.list.column.name') }}</div>
              <div>{{ t('worker.list.column.role') }}</div>
              <div>{{ t('worker.list.column.certificate') }}</div>
              <div>{{ t('worker.list.column.permits') }}</div>
            </div>

            <RouterLink
              v-for="item in items"
              :key="item.id"
              :data-test="`worker-row-${item.id}`"
              :to="{ name: 'WorkerDetailPage', params: { id: item.id } }"
              class="grid w-full grid-cols-[1fr_170px_170px_90px] items-center gap-2 border-t border-border
                px-3.5 py-3 text-left text-[13px] transition-colors hover:bg-surface-app">
              <span class="truncate font-semibold text-text-primary">{{ item.name }}</span>
              <span class="truncate text-text-secondary">{{ item.role }}</span>
              <span>
                <span
                  v-if="certificateStatusFor(item)"
                  :class="[STATUS_BADGE_CLASS[certificateStatusFor(item) as ECertificateStatus].bg,
                           STATUS_BADGE_CLASS[certificateStatusFor(item) as ECertificateStatus].fg]"
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap">
                  {{ t(`certificate.status.${certificateStatusFor(item)}`) }}
                </span>
                <span
                  v-else
                  class="text-[11.5px] text-text-tertiary">{{ t('worker.list.certificate.none') }}</span>
              </span>
              <span class="font-mono text-text-secondary">{{ item.permitCount ?? 0 }}</span>
            </RouterLink>
          </div>
        </div>

        <Paginate
          v-model:pagination="pagination"
          @update="fetch()" />
      </template>
    </div>

    <RegisterWorkerModal
      v-model="registerOpen"
      @created="onWorkerCreated($event)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import Empty from '@/components/display/Empty.vue'
import Paginate from '@/components/table/Paginate.vue'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'
import { certificateStatus } from '@/utils/CertificateStatus'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import { useWorkers } from '../composables/useWorkers'
import RegisterWorkerModal from '../components/RegisterWorkerModal.vue'

/**
 * wayfinder 062 — `/workers`, "the worker shown in another tab on the contractor app". Certificate
 * status reuses `CertificateStatus.ts`'s existing valid/expiring/expired vocabulary and colors —
 * `STATUS_BADGE_CLASS` mirrors `CertificateCard.vue`'s own map rather than inventing a second one.
 */
const STATUS_BADGE_CLASS: Record<ECertificateStatus, { bg: string, fg: string }> = {
  [ECertificateStatus.VALID]: { bg: 'bg-status-active-bg', fg: 'text-status-active-fg-emphasis' },
  [ECertificateStatus.EXPIRING_SOON]: { bg: 'bg-status-pending-bg', fg: 'text-status-pending-fg' },
  [ECertificateStatus.EXPIRED]: { bg: 'bg-status-rejected-bg', fg: 'text-status-rejected-fg' }
}

const { t } = useI18n()
const router = useRouter()

const { items, loading, search, pagination, isEmpty, fetch } = useWorkers()

const registerOpen: Ref<boolean> = ref(false)

/**
 * `certificateCount`/`latestExpiryDate` are the server-computed rollups the list endpoint
 * carries (`IWorker`) — never a second per-row certificate fetch. `undefined` when the worker
 * has never registered one, which the template reads as "no certificate" rather than a status.
 */
function certificateStatusFor (worker: IWorker): ECertificateStatus | undefined {
  if (!worker.certificateCount || !worker.latestExpiryDate) return undefined
  return certificateStatus(worker.latestExpiryDate, new Date())
}

function onWorkerCreated (worker: IWorker): void {
  void router.push({ name: 'WorkerDetailPage', params: { id: worker.id } })
}

onMounted((): void => {
  void fetch()
})
</script>

<style scoped>

</style>
