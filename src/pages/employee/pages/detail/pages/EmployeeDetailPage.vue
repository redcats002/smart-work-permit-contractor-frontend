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
import { computed, onMounted, ref } from 'vue'
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
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'

const route = useRoute()
const router = useRouter()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const employee = useInitDetail()
const employeeId = computed((): number => Number(route?.params?.id as string ?? ''))


const mockEmployeeDetail = ref<IEmployeeById>({
  id: 1,
  createdAt: '2026-03-12T07:00:00.000Z',
  updatedAt: '2026-03-12T07:00:00.000Z',
  status: 'ACTIVE',
  idCard: '1700401323201',
  titleName: 'MR',
  firstName: 'เจษฎากร',
  lastName: 'เมืองนาม',
  phoneNumber: '0823636036',
  birthDate: '2000-08-17',
  email: 'chet@softnova.co',
  role: 'SUPER_ADMIN',
  branchId: 101,
  mainAddress: {
    id: 1,
    address: '7/1 หมู่ 5',
    subDistrict: 'หนองสองห้อง',
    district: 'บ้านแพ้ว',
    province: 'สมุทรสาคร',
    postCode: '74120',
    urlGoogleMap: '',
    isSameCitizenAddress: true,
    isSameCurrentAddress: true
  },
  currentAddress: {
    id: 2,
    address: '7/1 หมู่ 5',
    subDistrict: 'หนองสองห้อง',
    district: 'บ้านแพ้ว',
    province: 'สมุทรสาคร',
    postCode: '74120',
    urlGoogleMap: '',
    isSameCitizenAddress: true,
    isSameCurrentAddress: true
  }
})

async function useFetch (): Promise<void> {
  // const { data } = await EmployeeService.getEmployeeFindOne(employeeId.value)
  // employee.value = useInitDetail(data).value
  employee.value = useInitDetail(mockEmployeeDetail.value).value
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
