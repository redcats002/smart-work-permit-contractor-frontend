<template>
  <div
    class="h-11 border border-gray-300 rounded-md px-3 py-1 flex items-center gap-2 min-w-50">
    <div class="flex items-center gap-2 w-full">
      <Avatar
        class="mr-2"
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        shape="circle"
        size="normal" />
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
        icon-class="text-font-gray! border-l-1 border-font-gray" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/Auth'
import { formatter } from '@/utils/Formatter'
import BaseActionMenu, { type IMenuItemAction } from '../base/BaseActionMenu.vue'
import { computed } from 'vue'
import useLogout from '@/pages/auth/composables/useLogout'

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
