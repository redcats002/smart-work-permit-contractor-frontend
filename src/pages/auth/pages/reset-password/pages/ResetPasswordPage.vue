<template>
  <section
    id="reset-password-page"
    class="grid h-screen w-screen place-content-center bg-(--color-surface-app) px-4 sm:px-0">
    <div class="w-136">
      <BaseContainer class="rounded-3xl!">
        <template v-if="tokenValid">
          <AuthHeader
            :description="t('platform.auth.resetPassword.subtitle')"
            :title="t('platform.auth.resetPassword.title')" />
          <ResetPasswordForm
            v-model="form"
            class="mt-6"
            @submit="onResetPassword()" />
        </template>
        <Empty
          v-else
          :description="t('platform.auth.resetPassword.tokenInvalidDescription')"
          :title="t('platform.auth.resetPassword.tokenInvalidTitle')"
          icon="solar:alarm-turn-off-broken" />
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import Empty from '@/components/display/Empty.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import AuthHeader from '../../login/components/auth/AuthHeader.vue'
import type { ResetPasswordFormValues } from '../schema/reset-password.schema'
import { useResetPasswordInitialValues } from '../schema/reset-password.schema'

const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const tokenValid = ref<boolean>(false)
const form = ref<ResetPasswordFormValues>(useResetPasswordInitialValues())

async function useCheckToken (): Promise<void> {
  const token = route.query.token as string

  const response = await AuthPublicService.checkTokenResetPassword({ token })
  if (!response.data.valid) {
    toast.error(t('platform.auth.resetPassword.tokenInvalidToast'))
    tokenValid.value = false
    return
  }

  tokenValid.value = true
}

// Contractors only ever reset their own password via this emailed-link flow — there is no
// "reset someone else's password" admin path in this single-role app — so a successful
// reset always sends the user back to the login page to sign in with the new password.
async function useResetPassword (): Promise<void> {
  const token = route.query.token as string

  await AuthPublicService.resetPassword({
    token,
    newPassword: form.value.newPassword,
    confirmNewPassword: form.value.confirmNewPassword
  })

  toast.success(t('platform.auth.resetPassword.success'))
  router.push({ name: 'LoginPage' })
}

function onResetPassword (): void {
  handleLoading(useResetPassword)
}

onMounted(async (): Promise<void> => {
  await router.isReady()
  handleLoading(useCheckToken)
})
</script>

<style scoped>

</style>
