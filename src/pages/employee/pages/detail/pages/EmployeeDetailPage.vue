<template>
  <section id="employee-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="employee"
          @delete="onDelete()"
          @edit="onEdit()"
          @reset-password="onResetPassword()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IAuthPublicProvider } from '@/resources/provider/auth/public/Auth.public.provider'
import AuthPublicProvider from '@/resources/provider/auth/public/Auth.public.provider'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()
const AuthPublicService: IAuthPublicProvider = new AuthPublicProvider()

const employee = useInitDetail()
const employeeId = computed((): TBaseParamsId => route?.params?.id as string ?? '')

async function useFetch (): Promise<void> {
  if (Number(employeeId.value) === 0) return
  const { data } = await EmployeeService.getEmployeeFindOne(employeeId.value)
  employee.value = useInitDetail(data).value
}

async function useDelete (): Promise<void> {
  if (!employeeId.value) throw new Error('Employee ID is required for deletion')
  await EmployeeService.deleteEmployee(employeeId.value)
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'EmployeeListPage' })
}

async function useResetPassword (): Promise<void> {
  if (!employee.value?.email) throw new Error('Employee email is required for password reset')
  await AuthPublicService.requestPasswordReset({ email: employee.value.email })
  toast.success('กรุณาตรวจสอบอีเมลของคุณ', 'ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ')
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'EmployeeEditPage', params: { id: employeeId.value } })
}

function onDelete (): void {
  handleLoading(useDelete)
}

function onResetPassword (): void {
  handleLoading(useResetPassword)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
