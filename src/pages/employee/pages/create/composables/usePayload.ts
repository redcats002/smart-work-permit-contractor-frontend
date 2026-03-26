import type { ICreateEmployeePayload } from '@/models/request/employee/EmployeeReq.model'
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
import type { EmployeeFormValues } from '../schema/employee.schema'

export function usePayload (form: EmployeeFormValues, images: IUploadResponse[]): ICreateEmployeePayload {
  return {
    ...form,
    image: images?.[0]?.fileUrl,
    password: form.idCard
  }
}
