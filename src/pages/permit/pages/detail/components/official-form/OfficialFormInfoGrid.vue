<template>
  <dl class="grid grid-cols-2 gap-0 border border-border text-[11px]">
    <div
      v-for="field in fields"
      :key="field.labelKey"
      class="flex items-baseline gap-2 border-b border-r border-border px-2 py-1.5 last:border-r-0 odd:border-r">
      <dt class="shrink-0 whitespace-nowrap text-text-tertiary">
        {{ t(`permit.detail.print.official.field.${field.labelKey}`) }}
      </dt>
      <dd class="min-w-0 grow border-b border-dotted border-text-tertiary/60 break-words">
        {{ field.value ?? '\u00A0' }}
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IOfficialFormField } from '@/pages/permit/pages/detail/constants/OfficialFormBlocks.model'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. Generic label/value grid
 * block (ส่วนที่ 1 request-details style rows). `field.value === null` prints an empty dotted line
 * (`&nbsp;`) rather than a placeholder like "-", matching the paper form's own blank-fill-in look.
 */
interface IProps {
  fields: IOfficialFormField[]
}

defineProps<IProps>()

const { t } = useI18n()
</script>
