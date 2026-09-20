<template>
  <table class="w-full border-collapse border border-border text-[10.5px]">
    <thead>
      <tr class="bg-surface-muted">
        <th class="border border-border px-2 py-1 text-left font-medium">
          {{ t('permit.detail.print.official.field.checklistItem') }}
        </th>
        <th
          v-for="dateColumn in dateColumns"
          :key="dateColumn"
          class="border border-border px-2 py-1 font-medium">
          {{ t('permit.detail.print.official.field.checklistDate') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.key">
        <td class="border border-border px-2 py-1">
          {{ t(`permit.detail.print.official.field.${item.labelKey}`) }}
        </td>
        <td
          v-for="dateColumn in dateColumns"
          :key="dateColumn"
          class="border border-border px-2 py-2" />
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOfficialFormChecklistItem } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Hot Work/Height's
 * three-stage (pre/during/post-work) checklist grid — a fixed item list repeated across N blank
 * date columns, entirely unchecked per ruling 1 (no new data-capture UI). Item text is verbatim
 * from the reference form images (`OfficialFormConfig.ts`'s `buildRealChecklistItems`).
 */
interface IProps {
  items: IOfficialFormChecklistItem[]
  dateColumns: number
}

defineProps<IProps>()

const { t } = useI18n()
</script>
