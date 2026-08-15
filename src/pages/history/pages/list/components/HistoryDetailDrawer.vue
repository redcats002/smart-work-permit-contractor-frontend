<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[100] flex justify-end bg-black/45"
    @click="emit('close')">
    <div
      class="flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-surface-card shadow-2xl"
      @click.stop>
      <div class="flex items-start gap-3.5 border-b border-border px-6 pt-5.5 pb-4">
        <div class="min-w-0 flex-1">
          <div
            v-if="detail"
            class="mb-1.5 flex items-center gap-2.5">
            <span
              :class="[TYPE_CHIP_CLASS[detail.type].bg, TYPE_CHIP_CLASS[detail.type].fg]"
              class="inline-flex items-center rounded-md px-2.5 py-1 text-[11.5px] font-semibold">
              {{ t(`history.type.${detail.type}`) }}
            </span>
            <span
              :class="[STATUS_CHIP_CLASS[detail.status as THistoryStatus].bg, STATUS_CHIP_CLASS[detail.status as THistoryStatus].fg]"
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
              {{ t(`history.status.${detail.status}`) }}
            </span>
          </div>
          <p
            v-if="detail"
            class="text-[19px] leading-tight font-bold tracking-tight text-text-primary">
            {{ detail.title }}
          </p>
          <p
            v-if="detail"
            class="mt-1 font-mono text-[11px] text-text-tertiary">
            {{ detail.id }}
          </p>
        </div>
        <button
          :aria-label="t('history.drawer.close')"
          class="shrink-0 p-0.5 text-xl leading-none text-text-tertiary"
          type="button"
          @click="emit('close')">
          ✕
        </button>
      </div>

      <div class="flex items-center gap-2.5 border-b border-border bg-surface-subtle px-6 py-2.5">
        <span class="text-base">🔒</span>
        <span
          v-if="detail"
          class="text-[12.5px] font-medium text-text-secondary">
          {{ t('history.drawer.viewOnly', { status: t(`history.status.${detail.status}`) }) }}
        </span>
      </div>

      <div
        v-if="loading"
        class="flex flex-1 items-center justify-center py-16 text-sm text-text-tertiary">
        …
      </div>

      <div
        v-else-if="detail"
        class="flex flex-col gap-3.5 px-6 py-5">
        <div class="rounded-[9px] bg-surface-subtle p-4">
          <p class="mb-2.5 text-[11px] font-bold tracking-wide text-text-tertiary">
            {{ t('history.drawer.sectionDetails') }}
          </p>
          <div class="grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.location') }}</span>
              <p class="mt-0.5 font-medium">
                {{ detail.location }}
              </p>
            </div>
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.foreman') }}</span>
              <p class="mt-0.5 font-medium">
                {{ detail.foreman }}
              </p>
            </div>
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.workDate') }}</span>
              <p class="mt-0.5 font-mono text-[11.5px]">
                {{ $dayjs.formatDate(detail.workDate) }} · {{ detail.workTimeStart }}–{{ detail.workTimeEnd }}
              </p>
            </div>
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.duration') }}</span>
              <p class="mt-0.5 font-medium">
                {{ formatDuration(detail.workTimeStart, detail.workTimeEnd) }}
              </p>
            </div>
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.closedDate') }}</span>
              <p class="mt-0.5 font-mono text-[11.5px]">
                {{ detail.closedAt ? $dayjs.formatDateTime(detail.closedAt) : '-' }}
              </p>
            </div>
            <div>
              <span class="text-text-secondary">{{ t('history.drawer.closedBy') }}</span>
              <p class="mt-0.5 font-medium">
                {{ closedByName }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-[9px] bg-surface-subtle p-4">
          <p class="mb-2 text-[11px] font-bold tracking-wide text-text-tertiary">
            {{ t('history.drawer.sectionWorkDescription') }}
          </p>
          <p class="text-[13.5px] leading-relaxed text-text-strong">
            {{ detail.workDescription }}
          </p>
        </div>

        <!-- Placeholder per design (SmartWorkPermit-v3.dc.html line ~718) — no document
             endpoint exists yet, keep this a non-functional placeholder row. -->
        <div class="flex items-center gap-2.5 rounded-[9px] border border-dashed border-border-input p-3.5">
          <span class="text-lg">📄</span>
          <span class="text-[13px] font-medium">{{ t('history.drawer.downloadPdf') }}</span>
          <span class="ml-auto rounded-md bg-surface-subtle px-2 py-0.5 text-[11.5px] text-text-tertiary">
            {{ t('history.drawer.placeholderChip') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import { useDayjs } from '@/utils/Dayjs'
import { formatDuration, STATUS_CHIP_CLASS, TYPE_CHIP_CLASS, type THistoryStatus } from '../composables/useHistory'

interface IProps {
  open: boolean
  loading: boolean
  detail: IPermitDetail | null
}

interface IEmits {
  close: []
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const $dayjs = useDayjs()

const closedByName: ComputedRef<string> = computed((): string => {
  const closedBy = props.detail?.closedBy
  if (!closedBy) return '-'
  return closedBy.fullName ?? `${closedBy.firstName} ${closedBy.lastName}`.trim()
})
</script>

<style scoped>

</style>
