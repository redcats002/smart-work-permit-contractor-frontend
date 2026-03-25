<template>
  <div
    class="h-12 border border-gray-300 rounded-md px-3 py-1 flex items-center gap-2 min-w-50">
    <div class="flex items-center gap-2 w-full">
      <Avatar
        :image="authStore.user?.image"
        class="mr-2 border border-gray-300 h-9 w-9"
        shape="circle"
        size="normal">
        <Icon
          v-if="!authStore.user?.image"
          icon="solar:user-bold" />
      </Avatar>
      <div>
        <p class="text-sm font-medium">
          {{ formatter.fullName(authStore.user) }}
        </p>
        <p class="text-xs text-gray-500">
          {{ formatter.stringFormatToCapitalize(authStore.user?.role || '') }}
        </p>
      </div>
    </div>
    <div>
      <BaseActionMenu
        :items="items"
        icon="mdi-chevron-down"
        icon-class="text-font-gray! border-l-1 border-font-gray h-full"
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
