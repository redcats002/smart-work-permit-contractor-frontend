<template>
  <div
    class="h-12 border border-gray-300 rounded-md px-2 py-1 md:px-3 flex items-center gap-2 min-w-fit md:min-w-50">
    <div class="flex items-center gap-2 w-full">
      <Avatar
        :image="authStore.user?.image"
        class="shrink-0 border border-gray-300 h-9 w-9"
        shape="circle"
        size="normal">
        <Icon
          v-if="!authStore.user?.image"
          icon="solar:user-bold" />
      </Avatar>
      <div class="hidden md:block">
        <p class="text-sm font-medium line-clamp-1">
          {{ formatter.fullName(authStore.user) }}
        </p>
        <p class="text-xs text-gray-500 line-clamp-1">
          {{ formatter.stringFormatToCapitalize(authStore.user?.role || '') }}
        </p>
      </div>
    </div>
    <div class="border-l border-gray-300 pl-1 md:pl-2 h-full flex items-center">
      <BaseActionMenu
        :items="items"
        icon="mdi-chevron-down"
        icon-class="text-font-gray!"
        menu-class="mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { formatter } from '@/utils/Formatter'
import useLogout from '@/pages/auth/composables/useLogout'
import { Icon } from '@iconify/vue'
import BaseActionMenu, { type IMenuItemAction } from '../base/BaseActionMenu.vue'

const authStore = useAuthStore()
const { logout } = useLogout()

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'Logout', key: 'logout', type: 'TEXT', action: (): void => { logout() } }
  ]
  return base
})

</script>

<style scoped>

</style>
