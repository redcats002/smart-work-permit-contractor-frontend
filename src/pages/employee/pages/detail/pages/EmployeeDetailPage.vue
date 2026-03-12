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
          @edit="onEdit()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
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
const employeeId = computed((): number => Number(route?.params?.id as string ?? ''))

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

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'EmployeeEditPage', params: { id: employeeId.value } })
}

function onDelete (): void {
  handleLoading(useDelete)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
