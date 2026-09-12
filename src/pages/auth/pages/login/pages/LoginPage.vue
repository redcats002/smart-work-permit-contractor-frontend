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
        <DemoLoginMenu
          :busy="demoBusy"
          @pick="onDemoLogin($event)" />
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
import DemoLoginMenu from '../components/auth/DemoLoginMenu.vue'
import type { IDemoAccount } from '../constants/DemoAccounts'
import LoginForm from '../components/auth/form/LoginForm.vue'
import { useInitForm } from '../composables/useInit'

/**
 * Two ways into this app: the typed form, and the Demo menu below it.
 *
 * The Demo menu REVERSES wayfinder 042's owner ruling of 2026-09-08 ("no demo environment will
 * exist... a flag that is off by default is still a route in the bundle and a password in a
 * runbook"), on the owner's instruction of 2026-09-09. The credentials are hardcoded and ship in
 * the production bundle — see DemoAccounts.ts for what that costs and what it obliges. The
 * earlier comment here said "do not re-add either button"; it is superseded, not forgotten.
 *
 * Still gone, and not part of that reversal: the SERVER-issued demo login (023) and the UAT
 * form-fill buttons (032). Those were a backend credential-minting route and a role-switcher, not
 * a client-side convenience, and nothing has reinstated them.
 */
const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { mapError } = useApiError()

const form = ref<ILoginPayload>(useInitForm())
const demoBusy = ref(false)

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

/**
 * Signs in with a demo account. Goes through `performLogin` rather than a shortcut, so the demo
 * path gets the same role gate, the same store write and the same error handling as a typed
 * sign-in — a demo login that took a different route would stop being evidence the real one works.
 */
function onDemoLogin (account: IDemoAccount): void {
  demoBusy.value = true
  handleLoading(async (): Promise<void> => performLogin({ email: account.email, password: account.password }), {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  }).finally((): void => {
    demoBusy.value = false
  })
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
