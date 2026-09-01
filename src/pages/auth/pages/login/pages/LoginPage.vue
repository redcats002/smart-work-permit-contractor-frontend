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

        <!--
          wayfinder ticket 032 — deliberately a SEPARATE section from the trial-login one above,
          with its own "UAT" heading, so the two are never mistaken for each other: this one fills
          the form fields and stops (nothing submitted, no session started); the one above signs
          in outright through the server-issued demo route.
        -->
        <div
          v-if="showTrialFill"
          class="mt-4 flex flex-col items-center gap-2 border-t border-border pt-5">
          <span class="text-[11px] font-semibold tracking-wide text-text-tertiary uppercase">
            {{ t('platform.auth.trialFill.label') }}
          </span>
          <SecondaryButton
            :label="t('platform.auth.trialFill.contractor')"
            class="w-full!"
            data-testid="trial-fill-contractor-button"
            size="small"
            type="button"
            @click="fillContractorCredentials()" />
          <p class="text-center text-[11px] text-text-tertiary">
            {{ t('platform.auth.trialFill.hint') }}
          </p>
        </div>
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
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
 * `applySession` below. Default OFF: hidden unless `VITE_TRIAL_LOGIN` is exactly `'true'`. The
 * server holds the password now (`POST /api/v1/auth/demo-login`, wayfinder 023) — this client
 * never sees or sends one. `demoLoginUnavailable` self-hides the button after a 404, which means
 * the deployment never set `DEMO_LOGIN_ENABLED=TRUE`: the endpoint will 404 on every subsequent
 * click too, so leaving the button up just invites repeat failures instead of surfacing the state
 * once.
 */
const demoLoginUnavailable: Ref<boolean> = ref(false)
const showTrialLogin: ComputedRef<boolean> = computed(
  (): boolean => import.meta.env.VITE_TRIAL_LOGIN === 'true' && !demoLoginUnavailable.value
)

/**
 * wayfinder ticket 032. Same flag as the trial-login button above (the owner's ruling — one flag,
 * not a second one), but a DIFFERENT affordance: this fills the visible form with a real test
 * account instead of calling the server. Not gated on `demoLoginUnavailable` — filling a form
 * never touches that endpoint, so a deployment where demo-login 404s should not also hide this.
 */
const showTrialFill: ComputedRef<boolean> = computed((): boolean => import.meta.env.VITE_TRIAL_LOGIN === 'true')

/**
 * Shared by the real form submit and the trial button once each has a session response — same
 * role gate, same store write, same redirect either way. Neither path mints a token client-side.
 */
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

async function performDemoLogin (): Promise<void> {
  const response = await AuthPublicService.demoLogin({ role: CONTRACTOR_ROLE })
  await applySession(response)
}

function onLogin (): void {
  handleLoading(async (): Promise<void> => performLogin(form.value), {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  })
}

function onTrialLogin (): void {
  if (!showTrialLogin.value) return
  handleLoading(async (): Promise<void> => performDemoLogin(), {}, (error: unknown): void => {
    const { status } = mapError(error)
    // Demo login is off by default (docs/wayfinder/tickets/023-server-issued-demo-login.md): a
    // build with the button visible pointed at a deployment that never set
    // `DEMO_LOGIN_ENABLED=TRUE` gets a plain 404 with no errorCode, which `mapError` would
    // otherwise fold into the generic "something went wrong" message. Name the actual state
    // instead, and stop offering a button that can only ever 404 again.
    if (status === 404) {
      demoLoginUnavailable.value = true
      toast.error(t('platform.auth.trial.unavailable'))
      return
    }
    toast.error(mapError(error).message)
  })
}

/**
 * wayfinder ticket 032. Mirrors `useInit.ts`'s `useInitForm` dev-autofill exactly: the credential
 * strings live INSIDE the `import.meta.env.VITE_TRIAL_LOGIN === 'true'` guard, not lifted to a
 * module-level constant referenced from inside it — Vite inlines that env read to a literal for
 * `vite build`, so a build with the flag unset compiles to `if (false) { ... return }`, which the
 * bundler's minifier proves unreachable and strips, strings included. Never sends anything —
 * `form.value` is the same ref the real `<LoginForm>` submit reads, so the tester still has to
 * press the real Sign In button, and can edit the fields first.
 */
function fillContractorCredentials (): void {
  if (import.meta.env.VITE_TRIAL_LOGIN !== 'true') return
  form.value = { email: 'contractor1@mail.com', password: 'adminadmin' }
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
