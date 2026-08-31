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

        <div
          v-if="showTrialLogin"
          class="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5">
          <span class="text-[11px] font-semibold tracking-wide text-text-tertiary uppercase">
            {{ t('platform.auth.trial.label') }}
          </span>
          <SecondaryButton
            :label="t('platform.auth.trial.contractor')"
            class="w-full!"
            data-testid="trial-login-button"
            size="small"
            type="button"
            @click="onTrialLogin()" />
        </div>
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { CONTRACTOR_ROLE, useAuthStore } from '@/stores/Auth'
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

/**
 * Demo affordance for showing the app without typing credentials — never a real auth bypass, see
 * `performLogin` below. Default OFF: hidden unless `VITE_TRIAL_LOGIN` is exactly `'true'` AND a
 * password is set. The password never has a client-side default — a missing env var hides the
 * button rather than guessing, so this can never fall back to sending an empty/placeholder
 * password to the real login endpoint.
 */
const TRIAL_LOGIN_EMAIL = 'contractor@e2e.test'
const trialLoginPassword: string | undefined = import.meta.env.VITE_TRIAL_LOGIN_PASSWORD
const showTrialLogin: ComputedRef<boolean> = computed(
  (): boolean => import.meta.env.VITE_TRIAL_LOGIN === 'true' && Boolean(trialLoginPassword)
)

/**
 * Shared by the real form submit and the trial button — same provider call, same role gate, same
 * error handling either way. The trial button is a shortcut to this exact flow, never a
 * side-door around it: no token is minted client-side and no store is written to directly.
 */
async function performLogin (payload: ILoginPayload): Promise<void> {
  // Login is the one endpoint that answers { success, data } rather than the { message, data }
  // envelope — see docs/main/dev-handoff/04-api-contract.md §2.
  const response = await AuthPublicService.login(payload)
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

function onLogin (): void {
  handleLoading(async (): Promise<void> => performLogin(form.value), {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  })
}

function onTrialLogin (): void {
  if (!showTrialLogin.value || !trialLoginPassword) return
  handleLoading(
    async (): Promise<void> => performLogin({ email: TRIAL_LOGIN_EMAIL, password: trialLoginPassword as string }), {}, (error: unknown): void => {
      toast.error(mapError(error).message)
    }
  )
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
