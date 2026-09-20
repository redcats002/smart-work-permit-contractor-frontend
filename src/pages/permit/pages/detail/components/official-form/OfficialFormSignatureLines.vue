<template>
  <div class="mt-1 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-3">
    <div
      v-for="roleLabelKey in roleLabelKeys"
      :key="roleLabelKey"
      class="flex flex-col gap-1">
      <span class="border-b border-dotted border-text-tertiary/60 py-3">
        {{ '\u00A0' }}
      </span>
      <span class="text-center text-text-tertiary">
        {{ t(`permit.detail.print.official.field.${roleLabelKey}`) }}
      </span>
      <span class="text-center text-text-tertiary">
        {{ t('permit.detail.print.official.field.signatureDatePlaceholder') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. A row of blank named
 * signature lines — ruling 1: no signature/checkbox/date on these forms is ever pre-filled or
 * recorded by this app, they exist for on-site pen-and-paper completion only.
 */
interface IProps {
  roleLabelKeys: string[]
}

defineProps<IProps>()

const { t } = useI18n()
</script>
