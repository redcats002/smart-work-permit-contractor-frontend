<template>
  <div class="flex gap-0.5 rounded-[7px] bg-(--color-shell-sidebar-hover) p-[3px]">
    <button
      v-for="option in options"
      :key="option.value"
      :class="locale === option.value
        ? 'bg-(--color-surface-card) text-(--color-shell-topbar)'
        : 'bg-transparent text-(--color-shell-topbar-muted) hover:text-white'"
      class="rounded-[5px] px-[11px] py-[5px] text-[11.5px] font-bold transition-colors"
      type="button"
      @click="setLocale(option.value)">
      {{ t(option.labelKey) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TLocale } from '@/locales'
import { setLocale } from '@/plugins/I18n.plugin'

interface ILocaleOption {
  value: TLocale
  labelKey: string
}

const { t, locale } = useI18n()

const options: ILocaleOption[] = [
  { value: 'en', labelKey: 'platform.localeSwitcher.en' },
  { value: 'th', labelKey: 'platform.localeSwitcher.th' }
]
</script>
