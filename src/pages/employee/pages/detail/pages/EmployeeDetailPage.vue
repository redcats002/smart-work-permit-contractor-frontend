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

const employee = useInitDetail()
const employeeId = computed((): TBaseParamsId => route?.params?.id as string ?? '')

async function useFetch (): Promise<void> {
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
  const mock = true // TODO: remove mock and uncomment code below when API is ready

  if (mock) return toast.warn('ฟีเจอร์นี้ยังไม่พร้อมใช้งานในขณะนี้')
  if (!employeeId.value) throw new Error('Employee ID is required for password reset')
  await EmployeeService.resetPassword(employeeId.value)
  toast.success('รีเซ็ตรหัสผ่านสำเร็จ')
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
