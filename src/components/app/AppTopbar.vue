<template>
  <header
    class="sticky top-0 z-50 flex h-[54px] shrink-0 items-center gap-[18px] border-b-2 border-(--color-primary-500)
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
      <!-- Primary red, not accent orange: the accent ramp is the SAFETY app's brand primary, so
           painting this app's chrome with it made the two indistinguishable (wayfinder 058). White
           on #c81e2c is 5.71:1; the old dark-on-orange was 6.06:1 and dark-on-red would be 3.23:1,
           so the text colour flips with the background rather than staying put. -->
      <div
        class="flex size-[30px] shrink-0 items-center justify-center rounded-[6px] bg-(--color-primary-500)
          text-base font-bold text-white">
        e
      </div>
      <div class="min-w-0 leading-[1.05]">
        <div class="truncate text-sm font-semibold tracking-[0.3px] text-white">
          {{ t('platform.appName') }}
        </div>
        <div class="truncate font-mono text-[10px] text-(--color-text-tertiary)">
          {{ t('platform.appTagline') }}
        </div>
      </div>
    </div>

    <div
      ref="panelRootRef"
      class="relative ml-auto shrink-0">
      <button
        :aria-label="t('platform.notifications.title')"
        class="relative flex size-9 items-center justify-center rounded text-(--color-shell-sidebar-fg)
          transition-colors hover:bg-(--color-shell-sidebar-hover)"
        type="button"
        @click="togglePanel()">
        <Icon
          class="size-5"
          icon="mdi:bell-outline" />
        <span
          v-if="unreadCount > 0"
          class="absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full
            bg-(--color-primary-500) px-[3px] text-[10px] font-bold leading-none text-white">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </button>

      <div
        v-if="isPanelOpen"
        class="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] max-w-[90vw] overflow-hidden rounded-[10px]
          border border-(--color-border) bg-(--color-surface-card) shadow-lg">
        <div
          class="border-b border-(--color-border) px-[16px] py-[12px] text-[13px] font-bold
            text-(--color-text-strong)">
          {{ t('platform.notifications.title') }}
        </div>

        <div class="max-h-[360px] overflow-y-auto">
          <p
            v-if="notifications.length === 0"
            class="px-[16px] py-[20px] text-center text-[12.5px] text-(--color-text-secondary)">
            {{ t('platform.notifications.empty') }}
          </p>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="notification.read ? 'bg-(--color-surface-card)' : 'bg-(--color-surface-muted)'"
            class="flex items-start gap-[10px] border-b border-(--color-border) px-[16px] py-[11px] last:border-b-0">
            <div class="min-w-0 flex-1">
              <div class="truncate text-[12.5px] font-medium text-(--color-text-strong)">
                {{ notification.title }}
              </div>
              <div class="mt-[2px] text-[11px] text-(--color-text-tertiary)">
                {{ $dayjs.formatDateTime(notification.createdAt) }}
              </div>
            </div>
            <button
              v-if="!notification.read"
              class="shrink-0 whitespace-nowrap text-[11px] font-medium text-(--color-primary-500) underline"
              type="button"
              @click="dismiss(notification.id)">
              {{ t('platform.notifications.dismiss') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <LocaleSwitcher class="shrink-0" />
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

import { toast } from '@/plugins/toast'

import { useNotificationStore } from '@/stores/Notification'

import { useDayjs } from '@/utils/Dayjs'

import Icon from '@/components/base/AppIcon.vue'

import { useApiError } from '@/composables/useApiError'

import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import LocaleSwitcher from './LocaleSwitcher.vue'

interface IEmits {
  toggleMenu: []
}
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const $dayjs = useDayjs()
const { mapError } = useApiError()

const notificationStore = useNotificationStore()
const { notifications, unreadCount } = storeToRefs(notificationStore)

const isPanelOpen = ref<boolean>(false)
const panelRootRef: Ref<HTMLElement | null> = ref(null)

function togglePanel (): void {
  isPanelOpen.value = !isPanelOpen.value
}

function closePanel (): void {
  isPanelOpen.value = false
}

function onClickOutside (event: MouseEvent): void {
  if (panelRootRef.value && !panelRootRef.value.contains(event.target as Node)) {
    closePanel()
  }
}

onMounted((): void => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount((): void => {
  document.removeEventListener('click', onClickOutside)
})

async function dismiss (id: number): Promise<void> {
  try {
    await notificationStore.dismiss(id)
  } catch (error) {
    toast.error(mapError(error).message)
  }
}
</script>
