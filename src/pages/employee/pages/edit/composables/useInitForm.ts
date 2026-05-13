import type { Ref } from 'vue'
import { isSameAddress } from '@/utils/Address'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { ETitleName } from '@/enums/TitleName.enum'
import type { EmployeeFormValues } from '../../create/schema/employee.schema'

const dayjs = useDayjs()

export function useInitForm (form: Ref<EmployeeFormValues>, data: IEmployeeById): void {
  form.value = {
    branchIds: data?.branches.map((b: IBranchList): string => typeof b.id === 'string' ? b.id : String(b.id)) || [],
    image: data?.image,
    mainAddress: {
      ...(data?.mainAddress || {}),
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    currentAddress: {
      ...(data?.currentAddress || {}),
      isSameCitizenAddress: isSameAddress(data?.currentAddress, data?.mainAddress),
      isSameCurrentAddress: false
    },
    dateOfBirth: data?.dateOfBirth ? dayjs(data.dateOfBirth).toDate() : undefined,
    email: data?.email || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    idCard: data?.idCard || '',
    phoneNumber: data?.phoneNumber || '',
    role: data?.role || undefined,
    status: data?.status || undefined,
    title: data?.title as ETitleName
  }
}
