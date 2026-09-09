<template>
  <section
    id="login-page"
    class="grid h-screen w-screen bg-(--color-surface-card) lg:grid-cols-2">
    <!-- Form left, decoration right. Below `lg` the panel is dropped entirely and the form gets
         the whole viewport: this app must not break at 375px, and a squeezed two-column layout
         is worse than one column on a phone the contractor is holding at a site gate. -->
    <div class="flex items-center justify-center overflow-y-auto px-4 py-10 sm:px-8">
      <div class="w-full max-w-96">
        <AuthHeader
          :description="t('platform.auth.subtitle')"
          :title="t('platform.auth.title')" />
        <LoginForm
          v-model="form"
          class="mt-8"
          @submit="onLogin()" />
      </div>
    </div>

    <AuthSplitPanel />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { CONTRACTOR_ROLE, useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import type { TActionLoginResponse } from '@/models/response/auth/public/AuthRes.public.model'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import AuthHeader from '../components/auth/AuthHeader.vue'
import AuthSplitPanel from '../components/auth/AuthSplitPanel.vue'
import LoginForm from '../components/auth/form/LoginForm.vue'
import { useInitForm } from '../composables/useInit'

/**
 * wayfinder ticket 042 — the trial/demo sign-in affordances are GONE, not disabled: the
 * server-issued demo-login button (023), the UAT form-fill button (032) and their shared
 * `VITE_TRIAL_LOGIN` guard. Owner ruling 2026-09-08: no demo environment will exist, and a flag
 * that is off by default is still a route in the bundle and a password in a runbook. The typed
 * form below is the only way into this app. Do not re-add either button.
 */
const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { mapError } = useApiError()

const form = ref<ILoginPayload>(useInitForm())

/** Applies a real sign-in response — the same role gate, store write and redirect for every caller. */
async function applySession (response: TActionLoginResponse): Promise<void> {
  const { user, token } = response.data

  // A safety officer or inspector can authenticate here, but every screen in this app calls
  // contractor-gated endpoints that would answer 403 FORBIDDEN_ROLE. Refuse the session outright
  // rather than signing them into an app that half-works.
  if (user.role !== CONTRACTOR_ROLE) {
    toast.error(t('error.FORBIDDEN_ROLE'))
    return
  }

  authStore.userLogin(user, token)
  toast.success(t('platform.auth.loginSuccess'))
  router.push({ name: 'PermitListPage' })
}

async function performLogin (payload: ILoginPayload): Promise<void> {
  // Login is the one endpoint that answers { success, data } rather than the { message, data }
  // envelope — see docs/main/dev-handoff/04-api-contract.md §2.
  const response = await AuthPublicService.login(payload)
  await applySession(response)
}

function onLogin (): void {
  handleLoading(async (): Promise<void> => performLogin(form.value), {}, (error: unknown): void => {
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
