<template>
  <table class="w-full border-collapse border border-border text-[11px]">
    <thead>
      <tr class="bg-surface-muted">
        <th
          v-for="column in columns"
          :key="column.labelKey"
          class="border border-border px-2 py-1 text-left font-medium">
          {{ t(`permit.detail.print.official.field.${column.labelKey}`) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, rowIndex) in rows"
        :key="rowIndex">
        <td
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          class="border border-border px-2 py-1.5">
          {{ cell ?? '\u00A0' }}
        </td>
      </tr>
      <tr
        v-for="blankRow in blankRowCount"
        :key="`blank-${blankRow}`">
        <td
          v-for="column in columns"
          :key="column.labelKey"
          class="border border-border px-2 py-1.5">
          {{ '\u00A0' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOfficialFormWorkerTableColumn } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Confined Space's
 * up-to-4-worker roster table. `blankRowCount` pads the table to the form's fixed 4-row capacity
 * so a permit with fewer than 4 workers still shows the full table shape.
 */
interface IProps {
  columns: IOfficialFormWorkerTableColumn[]
  rows: (string | null)[][]
  blankRowCount: number
}

defineProps<IProps>()

const { t } = useI18n()
</script>
