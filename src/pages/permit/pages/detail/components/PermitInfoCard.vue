<template>
  <div>
    <dl class="grid grid-cols-1 gap-x-5.5 gap-y-4 text-[13.5px] sm:grid-cols-2">
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.info.location') }}
        </dt>
        <dd class="text-text-primary break-words">
          {{ permit.location }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.info.foreman') }}
        </dt>
        <dd class="text-text-primary break-words">
          {{ permit.foreman }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.info.date') }}
        </dt>
        <dd class="text-text-primary">
          {{ workDate }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.info.time') }}
        </dt>
        <dd class="font-mono text-text-primary">
          {{ workTime }}
        </dd>
      </div>
      <div data-test="overview-environment">
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.sections.overview.environment') }}
        </dt>
        <dd class="text-text-primary">
          {{ permit.outdoorWork ? t('permit.detail.sections.overview.outdoor') : t('permit.detail.sections.overview.indoor') }}
        </dd>
      </div>
    </dl>

    <!--
      Lifecycle timestamps belong to the status story, not to a section of their own
      (05-permit-detail-sections.md §2). The audit trail lists the same events as entries.
    -->
    <p class="mt-5 mb-2.5 text-[11.5px] font-semibold tracking-wide text-text-tertiary uppercase">
      {{ t('permit.detail.sections.overview.lifecycle') }}
    </p>
    <dl
      class="grid grid-cols-1 gap-x-5.5 gap-y-3 text-[13px] sm:grid-cols-2"
      data-test="overview-lifecycle">
      <div
        v-for="row in lifecycleRows"
        :key="row.key">
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t(`permit.detail.sections.overview.${row.key}`) }}
        </dt>
        <dd
          :class="row.mono ? 'font-mono' : ''"
          class="text-text-primary break-words">
          {{ row.value }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

interface IProps {
  permit: IPermitDetail
}

interface ILifecycleRow {
  key: string
  value: string
  mono: boolean
}

const props = defineProps<IProps>()

const { t, d } = useI18n()

/**
 * `workDate` comes back as a full ISO timestamp even though it is sent as `YYYY-MM-DD`; the
 * i18n datetime formats pin the display timezone to Asia/Bangkok. Never round-trip this value.
 */
const workDate: ComputedRef<string> = computed((): string => d(new Date(props.permit.workDate), 'short'))

/** Work times are full ISO datetimes on the wire (not 'HH:mm') — render the Bangkok wall clock. */
function clock (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  }).format(parsed)
}

const workTime: ComputedRef<string> = computed((): string => `${clock(props.permit.workTimeStart)}–${clock(props.permit.workTimeEnd)}`)

/** Stored UTC, displayed Asia/Bangkok through the shared `long` datetime format. */
function stamp (value: string | null): string {
  if (!value) return t('permit.detail.sections.overview.none')
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return t('permit.detail.sections.overview.none')
  return d(parsed, 'long')
}

const lifecycleRows: ComputedRef<ILifecycleRow[]> = computed((): ILifecycleRow[] => {
  const permit = props.permit
  const rows: ILifecycleRow[] = [
    { key: 'createdBy', value: permitAuthorName(permit.createdBy) || t('permit.detail.sections.overview.none'), mono: false },
    { key: 'createdAt', value: stamp(permit.createdAt), mono: true },
    { key: 'updatedAt', value: stamp(permit.updatedAt), mono: true },
    { key: 'submittedAt', value: stamp(permit.submittedAt), mono: true }
  ]

  if (permit.approvedAt || permit.approvedBy) {
    rows.push({ key: 'approvedBy', value: permitAuthorName(permit.approvedBy) || t('permit.detail.sections.overview.none'), mono: false })
    rows.push({ key: 'approvedAt', value: stamp(permit.approvedAt), mono: true })
  }

  if (permit.rejectedAt || permit.rejectedReason) {
    rows.push({ key: 'rejectedAt', value: stamp(permit.rejectedAt), mono: true })
    rows.push({ key: 'rejectedReason', value: permit.rejectedReason || t('permit.detail.sections.overview.none'), mono: false })
  }

  return rows
})
</script>

<style scoped>

</style>
