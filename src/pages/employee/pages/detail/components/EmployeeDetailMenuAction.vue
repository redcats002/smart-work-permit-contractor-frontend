<template>
  <div>
    <BaseActionMenu :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'

interface IProps {}

interface IEmits {
  edit: []
  delete: []
  resetPassword: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const route = useRoute()

const authStore = useAuthStore()

const items = computed((): IMenuItemAction[] => {
  const base: IMenuItemAction[] = [
    { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { emits('edit') } },
    { label: 'รีเซ็ตรหัสผ่าน', key: 'resetPassword', type: 'CONFIRM', action: (): void => { emits('resetPassword') } },
    { label: 'ลบ', key: 'delete', action: (): void => { emits('delete') }, type: 'DELETE' }
  ]
  const isOwnProfile = route?.params?.id === String(authStore.user.id)
  if (authStore.user.role === 'SUPER_ADMIN' || isOwnProfile) return base
  base.splice(1, 1) // Remove reset password option for non-super admins and when not viewing own profile
  return base
})


</script>

<style scoped></style>
