<template>
  <div
    class="h-10 border border-gray-300 rounded-md px-2 py-1 md:px-3 flex items-center gap-2 min-w-fit md:min-w-50">
    <div class="flex items-center gap-2 w-full">
      <Avatar
        :image="authStore.user?.imageUrl"
        class="shrink-0 border border-gray-300 h-7! w-7!"
        shape="circle"
        size="normal">
        <Icon
          v-if="!authStore.user?.imageUrl"
          icon="solar:user-bold" />
      </Avatar>
      <div class="hidden md:block">
        <p class="text-xs font-medium line-clamp-1">
          {{ authStore.user?.name || formatter.fullName(authStore.user) }}
        </p>
        <p class="text-2xs text-gray-500 line-clamp-1">
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import useLogout from '@/pages/auth/composables/useLogout'
import useResolveUrl from '@/composables/useResolveUrl'
import { Icon } from '@iconify/vue'
import BaseActionMenu, { type IMenuItemAction } from '../base/BaseActionMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useLogout()
const { resolveUploadImageUrl } = useResolveUrl()


const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'โปรไฟล์', key: 'profile', type: 'TEXT', action: (): void => { router.push({ name: 'ProfileDetailPage' }) } },
    { label: 'Logout', key: 'logout', type: 'TEXT', action: (): void => { logout() } }
  ]
  return base
})

onMounted((): void => {
  handleLoading(async (): Promise<void> => {
    const { url } = await resolveUploadImageUrl(authStore.user?.image)
    authStore.setUserImage(url)
  })
})

</script>

<style scoped>

</style>
