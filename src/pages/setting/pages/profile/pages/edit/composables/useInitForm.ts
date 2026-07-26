import type { Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { EmployeeFormValues } from '@/pages/employee/pages/create/schema/employee.schema'

const dayjs = useDayjs()

export function useInitForm (form: Ref<EmployeeFormValues>, data: IEmployeeById): void {
  form.value = {
    ...data,
    branchIds: data?.branches?.map((branch: IBranchList) => branch.id) || [],
    idCard: data?.idCard || '',
    title: data?.title || 'MR',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    dateOfBirth: (data.dateOfBirth ? dayjs(data.dateOfBirth).toISOString() : '') as unknown as string,
    email: data?.email || '',
    phoneNumber: data?.phoneNumber || ''
  }
}
