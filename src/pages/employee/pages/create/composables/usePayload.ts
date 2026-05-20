import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { EmployeeFormValues } from '../schema/employee.schema'

export function usePayload (form: EmployeeFormValues, images: IMedia[]): ICreateEmployeePayload {
  return {
    ...form,
    phoneNumber: form?.phoneNumber?.replaceAll(/-/g, ''),
    image: images?.[0]?.path,
    password: form.idCard
  }
}
