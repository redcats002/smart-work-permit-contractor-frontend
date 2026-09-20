<template>
  <p class="text-[10px] text-text-tertiary italic">
    * {{ t(`permit.detail.print.official.field.${textKey}`, params ?? {}) }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. A static explanatory
 * footer line (permit validity window, entry-scope note, restoration note) — never permit-specific
 * data, always the same text for every permit of that type.
 */
interface IProps {
  textKey: string
  params?: Record<string, string | number>
}

defineProps<IProps>()

const { t } = useI18n()
</script>
