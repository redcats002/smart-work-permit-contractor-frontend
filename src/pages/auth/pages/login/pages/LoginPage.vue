<template>
  <section
    id="login-page"
    class="w-screen h-screen grid place-content-center">
    <div class="w-136">
      <BaseContainer class="rounded-3xl!">
        <template v-if="state === 'AUTH'">
          <AuthHeader
            description="กรอกอีเมลและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ"
            title="เข้าสู่ระบบ" />
          <!-- <PreLoginForm
            v-if="authState === 'PRE_LOGIN'"
            v-model="form"
            @submit="onPreLogin()" /> -->
          <LoginForm
            v-if="authState === 'LOGIN'"
            v-model="form"
            @submit="onLogin()" />
          <SetPasswordForm
            v-if="authState === 'SET_PASSWORD'"
            v-model="form"
            @submit="onRegister()" />
        </template>
        <template v-else>
          <SelectBranchHeader @back="resetState()" />
          <SelectBranchBody
            :branches="branches"
            @approve="onApproveBranch($event)"
            @reject="onRejectBranch($event)"
            @submit="onSelectBranch($event)" />
        </template>
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import type { IAuthBranchList } from '@/models/response/auth/private/AuthRes.private.model'
import type { ILoginResponse, IRegisterResponse } from '@/models/response/auth/public/AuthRes.public.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import AuthPrivateProvider, { type IAuthPrivateProvider } from '@/resources/provider/auth/private/Auth.private.provider'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AuthHeader from '../components/auth/AuthHeader.vue'
import LoginForm from '../components/auth/form/LoginForm.vue'
import SetPasswordForm from '../components/auth/form/SetPasswordForm.vue'
import SelectBranchBody from '../components/select-branch/SelectBranchBody.vue'
import SelectBranchHeader from '../components/select-branch/SelectBranchHeader.vue'
import useResolveUrl from '@/composables/useResolveUrl'
import { useInitForm } from '../composables/useInit'
import { useLoginPayload, useRegisterPayload } from '../composables/usePayload'

type TState = 'AUTH' | 'SELECT_BRANCH'
type TAuthState = 'PRE_LOGIN' | 'LOGIN' | 'SET_PASSWORD'

const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()
const AuthPrivateService: IAuthPrivateProvider = new AuthPrivateProvider()

const router = useRouter()
const authStore = useAuthStore()

const { resolveUploadImageUrl } = useResolveUrl()

const form = ref<IActionLoginPayload>(useInitForm())
const state = ref<TState>('AUTH')
const authState = ref<TAuthState>('LOGIN')
const branches = ref<IAuthBranchList[]>([])

// async function usePreLogin (): Promise<void> {
//   const mock = true // !DEPRECATED: security issue
//   if (mock) {
//     toast.warn('pre-login mock')
//     if (form.value.email === 'systemuser@email.com') return setAuthState('LOGIN')
//     setAuthState('SET_PASSWORD')
//   } else {
//     const response = await AuthPublicService.preLogin(usePreLoginPayload(form.value))
//     if (response.data?.isNew) return setAuthState('SET_PASSWORD')
//     setAuthState('LOGIN')
//   }
//   toast.success('กรุณากรอกรหัสผ่านของคุณ')
// }

async function useLogin (): Promise<void> {
  const responseLogin = await AuthPublicService.login(useLoginPayload(form.value))
  const responseBranch = await AuthPrivateService.getBranch()
  setBranchState(responseLogin.data, responseBranch.data || [])
  toast.success('กรุณาเลือกสาขาที่ต้องการเข้าใช้งาน')
}

async function useRegister (): Promise<void> {
  await AuthPublicService.register(useRegisterPayload(form.value))
  const responseLogin = await AuthPublicService.login(useLoginPayload(form.value))
  const responseBranch = await AuthPrivateService.getBranch()
  setBranchState(responseLogin.data, responseBranch.data || [])
  toast.success('ตั้งรหัสผ่านสำเร็จ')
}

async function useSelectBranch (branchId: TBaseParamsId, branch: IAuthBranchList): Promise<void> {
  await AuthPrivateService.selectBranch({ branchId })
  authStore.branchLogin(branch)
  const { url } = await resolveUploadImageUrl(authStore.user?.image)
  authStore.setUserImage(url)
  toast.success('ยินดีต้อนรับเข้าสู่ระบบ')
  router.push({ name: 'HomePage' })
}

// !DEPRECATED: Not use accept/reject branch anymore, just auto approve for now
async function useApproveBranch (branchId: TBaseParamsId): Promise<void> {
  const response = await AuthPrivateService.approveBranch({ branchId })
  branches.value = response.data?.branches || []
}

async function useRejectBranch (branchId: TBaseParamsId): Promise<void> {
  const response = await AuthPrivateService.rejectBranch({ branchId })
  branches.value = response.data?.branches || []
}

function setBranchState (data: ILoginResponse | IRegisterResponse, _branches: IAuthBranchList[]): void {
  setState('SELECT_BRANCH')
  authStore.userLogin(data.user, data.token)
  branches.value = _branches
}

function setState (_state: TState): void {
  state.value = _state
}

function resetState (): void {
  setState('AUTH')
  setAuthState('LOGIN')
  form.value = useInitForm()
}

function setAuthState (_state: TAuthState): void {
  authState.value = _state
}

// function onPreLogin (): void {
//   handleLoading(usePreLogin)
// }

function onLogin (): void {
  handleLoading(useLogin)
}

function onRegister (): void {
  handleLoading(useRegister)
}

function onSelectBranch (branch: IAuthBranchList): void {
  handleLoading((): Promise<void> => useSelectBranch(branch.id, branch))
}

function onApproveBranch (branchId: TBaseParamsId): void {
  handleLoading((): Promise<void> => useApproveBranch(branchId))
}

function onRejectBranch (branchId: TBaseParamsId): void {
  handleLoading((): Promise<void> => useRejectBranch(branchId))
}
</script>

<style scoped>
#login-page {
	background-image: url('/assets/images/bg.jpg');
	background-color: #cccccc;
}
</style>
