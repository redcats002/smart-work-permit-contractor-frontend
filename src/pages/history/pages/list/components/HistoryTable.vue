<template>
  <!--
    wayfinder ticket 029. Two deliberately different shapes, not one table left to `overflow` on a
    narrow screen: `md:` and up keeps the single-line grid (every cell `truncate`s rather than
    wraps — a row is always exactly one line tall). Below `md:` the grid is replaced outright by a
    stacked card per permit, reusing the id/status-badge-top, title/location-below,
    chips-row-bottom idiom `PermitCard.vue` already established for this app's other list pages —
    not a new pattern. The desktop grid keeps every column (still reachable at `sm:`/tablet widths
    via horizontal scroll, `styling-rules.md`'s "acceptable only inside a table" case); the mobile
    card keeps every field too, just re-flowed instead of scrolled, because on a touch screen a
    horizontally-scrolling data table is the failure mode this ticket exists to fix.
  -->
  <div class="hidden overflow-x-auto rounded-[11px] border border-border bg-surface-card md:block">
    <div class="min-w-[700px]">
      <div
        class="grid grid-cols-[150px_90px_1fr_140px_80px_90px_36px] gap-2 bg-surface-subtle px-3.5 py-2.5
          text-[10.5px] font-semibold tracking-wide text-text-secondary">
        <div>{{ t('history.table.columns.id') }}</div>
        <div>{{ t('history.table.columns.type') }}</div>
        <div>{{ t('history.table.columns.titleLocation') }}</div>
        <div>{{ t('history.table.columns.closed') }}</div>
        <div>{{ t('history.table.columns.duration') }}</div>
        <div>{{ t('history.table.columns.status') }}</div>
        <div />
      </div>

      <button
        v-for="permit in items"
        :key="permit.id"
        :class="typeBorderClass(permit.type)"
        class="grid w-full grid-cols-[150px_90px_1fr_140px_80px_90px_36px] items-center gap-2 border-t border-l-[3px]
          border-border px-3.5 py-3 text-left text-[13px] transition-colors hover:bg-surface-app"
        type="button"
        @click="emit('select-row', permit.id)">
        <span class="truncate font-mono text-[11px] font-semibold text-text-strong">{{ permit.id }}</span>

        <span>
          <span
            :class="[typeChipClass(permit.type).bg, typeChipClass(permit.type).fg]"
            class="inline-flex items-center rounded-md px-2 py-0.5 text-[11.5px] font-semibold">
            {{ t(`history.type.${permit.type}`) }}
          </span>
        </span>

        <span class="min-w-0">
          <span class="block truncate text-[13px] font-semibold text-text-primary">{{ permit.title }}</span>
          <span class="mt-0.5 block truncate text-[11.5px] text-text-tertiary">{{ permit.location }}</span>
        </span>

        <span class="font-mono text-[11px] text-text-secondary">
          <span class="block">{{ formatClosedDate(permit) }}</span>
          <span
            v-if="permit.closedBy"
            class="mt-0.5 block text-[10.5px] text-text-quaternary">
            {{ closedByName(permit) }}
          </span>
        </span>

        <span class="text-[12px] text-text-secondary">{{ formatDuration(permit.workTimeStart, permit.workTimeEnd) }}</span>

        <span>
          <span
            :class="[statusChipClass(permit.status).bg, statusChipClass(permit.status).fg]"
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
            <PermitStatusGlyph :status="permit.status" />
            {{ t(`history.status.${permit.status}`) }}
          </span>
        </span>

        <span class="text-center text-base text-text-quaternary">›</span>
      </button>
    </div>
  </div>

  <div
    class="flex flex-col gap-2.5 md:hidden"
    data-test="history-table-mobile">
    <button
      v-for="permit in items"
      :key="permit.id"
      :class="typeBorderClass(permit.type)"
      class="block w-full rounded-xl border border-l-[5px] bg-surface-card p-3.5 text-left shadow-xs transition-shadow hover:shadow-lg"
      type="button"
      @click="emit('select-row', permit.id)">
      <div class="flex items-start justify-between gap-2.5">
        <span class="truncate font-mono text-[11px] tracking-wide text-text-tertiary">{{ permit.id }}</span>
        <span
          :class="[statusChipClass(permit.status).bg, statusChipClass(permit.status).fg]"
          class="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
          <PermitStatusGlyph :status="permit.status" />
          {{ t(`history.status.${permit.status}`) }}
        </span>
      </div>

      <p class="mt-2 mb-0.5 truncate text-[15px] font-semibold tracking-tight text-text-primary">
        {{ permit.title }}
      </p>
      <p class="mb-3 truncate text-xs text-text-secondary">
        {{ permit.location }}
      </p>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-text-secondary">
        <span
          :class="[typeChipClass(permit.type).bg, typeChipClass(permit.type).fg]"
          class="inline-flex items-center rounded-md px-2 py-0.5 font-semibold">
          {{ t(`history.type.${permit.type}`) }}
        </span>
        <span class="font-mono">{{ formatClosedDate(permit) }}<template v-if="permit.closedBy"> · {{ closedByName(permit) }}</template></span>
        <span>{{ formatDuration(permit.workTimeStart, permit.workTimeEnd) }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'
import { useDayjs } from '@/utils/Dayjs'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import PermitStatusGlyph from '@/components/chip/PermitStatusGlyph.vue'
import {
  formatDuration, STATUS_CHIP_CLASS, TYPE_BORDER_CLASS, TYPE_CHIP_CLASS, type THistoryStatus
} from '../composables/useHistory'

interface IProps {
  items: IPermitListItem[]
}

interface IEmits {
  'select-row': [id: string]
}

defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const $dayjs = useDayjs()

function typeBorderClass (type: TPermitType): string {
  return TYPE_BORDER_CLASS[type]
}

function typeChipClass (type: TPermitType): { bg: string, fg: string } {
  return TYPE_CHIP_CLASS[type]
}

function statusChipClass (status: string): { bg: string, fg: string } {
  return STATUS_CHIP_CLASS[status as THistoryStatus]
}

function formatClosedDate (permit: IPermitListItem): string {
  return permit.closedAt ? $dayjs.formatDate(permit.closedAt) : '-'
}

function closedByName (permit: IPermitListItem): string {
  const closedBy = permit.closedBy
  if (!closedBy) return ''
  return permitAuthorName(closedBy)
}
</script>

<style scoped>

</style>
