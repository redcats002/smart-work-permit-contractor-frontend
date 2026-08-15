<template>
  <section
    id="login-page"
    class="grid h-screen w-screen place-content-center bg-(--color-surface-app) px-4 sm:px-0">
    <div class="w-full max-w-136">
      <BaseContainer class="rounded-3xl!">
        <AuthHeader
          :description="t('platform.auth.subtitle')"
          :title="t('platform.auth.title')" />
        <LoginForm
          v-model="form"
          class="mt-6"
          @submit="onLogin()" />
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AuthHeader from '../components/auth/AuthHeader.vue'
import LoginForm from '../components/auth/form/LoginForm.vue'
import { useInitForm } from '../composables/useInit'

const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { mapError } = useApiError()

const form = ref<ILoginPayload>(useInitForm())

async function useLogin (): Promise<void> {
  const response = await AuthPublicService.login(form.value)
  authStore.userLogin(response.data.user, response.data.token)
  toast.success(t('platform.auth.loginSuccess'))
  router.push({ name: 'PermitListPage' })
}

function onLogin (): void {
  handleLoading(useLogin, {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  })
}

// Already-logged-in users hitting /auth/login directly (bookmark, browser back) go
// straight to their list instead of re-entering credentials.
onMounted((): void => {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'PermitListPage' })
  }
})
</script>

<style scoped>

</style>
