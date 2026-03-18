import type { Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { ETitleName } from '@/enums/TitleName.enum'
import type { EmployeeFormValues } from '../../create/schema/employee.schema'

const dayjs = useDayjs()

export function useInitForm (form: Ref<EmployeeFormValues>, data: IEmployeeById): void {
  form.value = {
    ...data,
    branchIds: data?.branches.map((b: IBranchList): string => typeof b.id === 'string' ? b.id : String(b.id)) || [],
    image: data?.image,
    currentAddress: data?.currentAddress || '',
    dateOfBirth: data?.dateOfBirth ? dayjs(data.dateOfBirth).toDate() : undefined,
    email: data?.email || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    idCard: data?.idCard || '',
    mainAddress: data?.mainAddress || '',
    phoneNumber: data?.phoneNumber || '',
    role: data?.role || undefined,
    status: data?.status || undefined,
    title: data?.title as ETitleName,
    password: '' // Set default password as empty string for edit form
  }
}
