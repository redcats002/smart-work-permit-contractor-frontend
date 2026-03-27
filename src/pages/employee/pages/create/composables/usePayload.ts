import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { EmployeeFormValues } from '../schema/employee.schema'

export function usePayload (form: EmployeeFormValues, images: IMedia[]): ICreateEmployeePayload {
  return {
    ...form,
    image: images?.[0]?.url,
    password: form.idCard
  }
}
