<template>
  <ul class="flex flex-col gap-1 border border-border p-2 text-[11px]">
    <li
      v-for="item in items"
      :key="item.key"
      class="flex items-center gap-3">
      <span class="min-w-0 grow">{{ t(`permit.detail.print.official.field.${item.labelKey}`, { n: itemNumber(item.key) }) }}</span>

      <span
        v-if="mode === 'single'"
        aria-hidden="true"
        class="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-text-secondary text-[9px]">
        {{ item.answer === 'yes' ? '✓' : '' }}
      </span>

      <span
        v-else
        class="flex shrink-0 items-center gap-2 text-[10px] text-text-tertiary">
        <span
          v-for="option in TRI_STATE_OPTIONS"
          :key="option"
          class="flex items-center gap-0.5">
          <span
            aria-hidden="true"
            class="inline-flex h-3.5 w-3.5 items-center justify-center border border-text-secondary">
            {{ item.answer === option ? '✓' : '' }}
          </span>
          {{ t(`permit.detail.print.official.answer.${option}`) }}
        </span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOfficialFormCheckboxItem } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Generic checkbox-list
 * block — 'single' renders one empty/checked box per row (e.g. the contractor checkbox, the
 * "type of work" row); 'tri-state' renders Yes/No/N-A boxes per row (Confined Space's 11-item
 * safety-measures list). `item.answer === null` leaves every box in the row empty.
 */
interface IProps {
  mode: 'single' | 'tri-state'
  items: IOfficialFormCheckboxItem[]
}

defineProps<IProps>()

const TRI_STATE_OPTIONS: Array<'yes' | 'no' | 'na'> = ['yes', 'no', 'na']

const { t } = useI18n()

/** `key` is `${prefix}-${n}` for a numbered placeholder row — the trailing number is its display number. */
function itemNumber (key: string): string {
  return key.split('-').pop() ?? key
}
</script>
