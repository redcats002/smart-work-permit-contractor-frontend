import type { EmployeeFormValues } from '@/pages/employee/pages/create/schema/employee.schema'
import type { IBasePaginationRequest } from '../Request.model'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'

export interface ICreateEmployeePayload extends EmployeeFormValues {}
export interface IUpdateEmployeePayload extends Partial<ICreateEmployeePayload> {}

export interface IGetEmployeeList extends IBasePaginationRequest {
  status?: TCustomerStatus
}
export interface IGetEmployeeContractList extends IBasePaginationRequest {}
export interface IGetEmployeePaymentHistoryList extends IBasePaginationRequest {}
export interface IGetEmployeeContactHistoryList extends IBasePaginationRequest {}
export interface IGetEmployeeEstateList extends IBasePaginationRequest {}
