import type { IUpdateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { EmployeeFormValues } from '../../create/schema/employee.schema'

export function usePayload (form: EmployeeFormValues, images: IMedia[]): IUpdateEmployeePayload {
  return {
    ...form,
    image: images?.[0]?.url,
    password: undefined
  }
}
