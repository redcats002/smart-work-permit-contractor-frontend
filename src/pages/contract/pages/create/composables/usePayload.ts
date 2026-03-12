import type { ICreateContractPayload, IEstateItem } from '@/models/request/contract/ContractReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TEstateAssessmentStatus } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import type { TEstateType } from '@/enums/modules/contract/EstateType.enum'
import type { IEstateFormItem, PreContractFormValues } from '../schema/pre-contract.schema'

export function usePayload (
  form: PreContractFormValues,
  selectedCustomer: ICustomerById,
  submitMode: TEstateAssessmentStatus
): ICreateContractPayload {
  return {
    customerId: selectedCustomer.id!,
    estateStatus: submitMode,
    estates: form.estates.map(
      (c: IEstateFormItem): IEstateItem => ({
        estateType: c.collateralType as TEstateType,
        detail: c.detail,
        // Land fields
        address: c.address,
        subDistrict: c.subDistrict,
        district: c.district,
        province: c.province,
        postCode: c.postCode,
        urlGoogleMap: c.urlGoogleMap,
        // Vehicle fields
        brand: c.brand,
        vehicleModel: c.vehicleModel,
        color: c.color,
        licensePlate: c.licensePlate,
        vehicleProvince: c.vehicleProvince,
        yearManufactured: c.yearManufactured,
        yearRegistered: c.yearRegistered,
        chassisNumber: c.chassisNumber,
        engineNumber: c.engineNumber,
        mileage: c.mileage
      })
    )
  }
}
