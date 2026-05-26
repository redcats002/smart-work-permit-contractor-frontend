<template>
  <section
    id="reset-password-page"
    class="w-screen h-screen grid place-content-center">
    <div class="w-136">
      <BaseContainer class="rounded-3xl!">
        <template v-if="tokenValid">
          <AuthHeader
            description="กรอกรหัสผ่านใหม่ของคุณ"
            title="ตั้งรหัสผ่านใหม่" />
          <ResetPasswordForm
            v-model="form"
            @submit="onResetPassword()" />
        </template>
        <Empty
          v-else
          description="กรุณากดขอลิงก์รีเซ็ตพาสเวิร์ดอีกครั้ง"
          icon="solar:alarm-turn-off-broken"
          title="โทเค้นหมดอายุ" />
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import Empty from '@/components/display/Empty.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import useLogout from '@/pages/auth/composables/useLogout'
import AuthHeader from '../../login/components/auth/AuthHeader.vue'
import type { ResetPasswordFormValues } from '../schema/reset-password.schema'
import { useResetPasswordInitialValues } from '../schema/reset-password.schema'

const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useLogout()

const tokenValid = ref<boolean>(false)
const form = ref<ResetPasswordFormValues>(useResetPasswordInitialValues())
const userId = computed((): string | undefined => route?.query?.userId as string || undefined)
async function useCheckToken (): Promise<void> {
  const token = route.query.token as string

  const response = await AuthPublicService.checkTokenResetPassword({ token })
  if (!response.data.valid) {
    toast.error('ลิงก์หมดอายุหรือไม่ถูกต้อง')
    tokenValid.value = false
    return
  }

  tokenValid.value = true
}

async function useResetPassword (): Promise<void> {
  const token = route.query.token as string

  await AuthPublicService.resetPassword({
    token,
    newPassword: form.value.newPassword,
    confirmNewPassword: form.value.confirmNewPassword
  })

  toast.success('ตั้งรหัสผ่านใหม่สำเร็จ')

  if (String(authStore.user.id) === userId.value) {
    logout()
    return
  }
  router.push({ name: 'EmployeeDetailPage', params: { id: userId.value } })
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
#reset-password-page {
  background-image: url('/assets/images/bg.jpg');
  background-color: #cccccc;
}
</style>
