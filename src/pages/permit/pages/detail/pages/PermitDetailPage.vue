<template>
  <div class="flex min-h-80 flex-col items-center justify-center gap-2 px-4 py-16 text-center">
    <p class="text-xs font-semibold tracking-wide text-text-tertiary uppercase">
      {{ t('permit.detail.placeholderBadge') }}
    </p>
    <h1 class="text-2xl font-bold text-text-primary">
      {{ t('permit.detail.title') }}
    </h1>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.detail.comingSoon') }}
    </p>
    <p class="font-mono text-xs text-text-tertiary">
      {{ route.params.id }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

/**
 * PLACEHOLDER — the status-banner / QR / audit-timeline detail screen is built in
 * PMT-010+. This page exists only so the PermitDetailPage route resolves and permit
 * cards have a click target. Do not build the detail screen here.
 */
const { t } = useI18n()
const route = useRoute()
</script>

<style scoped>

</style>
