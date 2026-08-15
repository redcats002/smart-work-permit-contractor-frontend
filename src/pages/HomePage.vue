<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted((): void => {
  router.replace({ name: authStore.isAuthenticated ? 'PermitListPage' : 'LoginPage' })
})
</script>

<style scoped></style>
