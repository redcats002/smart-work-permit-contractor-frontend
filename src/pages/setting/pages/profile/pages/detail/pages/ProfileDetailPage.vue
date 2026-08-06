<template>
  <section id="profile-detail-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail :data="employee">
          <template #menu-action>
            <ProfileDetailMenuAction @edit="onEdit()" />
          </template>
        </InformationDetail>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '@/pages/employee/pages/detail/components/InformationDetail.vue'
import ProfileDetailMenuAction from '../components/ProfileDetailMenuAction.vue'
import { useInitDetail } from '../composables/useInitDetail'

const router = useRouter()
const authStore = useAuthStore()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const employee = useInitDetail()

async function useFetch (): Promise<void> {
  const employeeId = authStore.user.id
  if (!employeeId) return
  const { data } = await EmployeeService.getEmployeeFindOne(employeeId)
  employee.value = useInitDetail(data).value
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'ProfileEditPage' })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
