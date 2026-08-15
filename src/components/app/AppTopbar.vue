<template>
  <header
    class="sticky top-0 z-50 flex h-[54px] shrink-0 items-center gap-[18px] border-b-2 border-(--color-accent-500)
      bg-(--color-shell-topbar) px-[18px]">
    <button
      :aria-label="t('platform.menu')"
      class="flex size-9 shrink-0 items-center justify-center rounded text-(--color-shell-sidebar-fg)
        transition-colors hover:bg-(--color-shell-sidebar-hover) min-[900px]:hidden"
      type="button"
      @click="emit('toggleMenu')">
      <Icon
        class="size-5"
        icon="mdi:menu" />
    </button>

    <div class="flex min-w-0 items-center gap-[10px]">
      <div
        class="flex size-[30px] shrink-0 items-center justify-center rounded-[6px] bg-(--color-accent-500)
          text-base font-bold text-(--color-shell-topbar)">
        S
      </div>
      <div class="min-w-0 leading-[1.05]">
        <div class="truncate text-sm font-bold tracking-[0.3px] text-white">
          {{ t('platform.appName') }}
        </div>
        <div class="truncate font-mono text-[10px] text-(--color-text-tertiary)">
          {{ t('platform.appTagline') }}
        </div>
      </div>
    </div>

    <LocaleSwitcher class="ml-auto shrink-0" />
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LocaleSwitcher from './LocaleSwitcher.vue'

interface IEmits {
  toggleMenu: []
}
const emit = defineEmits<IEmits>()

const { t } = useI18n()
</script>
