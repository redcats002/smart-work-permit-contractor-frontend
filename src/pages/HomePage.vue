<template>
  <LandingPage v-if="showLanding" />
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import LandingPage from '@/pages/LandingPage.vue'

const router = useRouter()
const authStore = useAuthStore()

// An authenticated visit to '/' keeps the old behaviour: bounce straight into the app, no
// content ever rendered. An unauthenticated visit no longer bounces to LoginPage — it renders
// the public LandingPage in place, at the same '/' URL, so the URL that ships in the sitemap
// (see public/sitemap.xml) never redirects.
const showLanding: Ref<boolean> = ref(false)

onMounted((): void => {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'PermitListPage' })
  } else {
    showLanding.value = true
  }
})
</script>

<style scoped></style>
