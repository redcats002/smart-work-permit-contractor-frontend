import type { ICreatePreContractPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { IEstateFormItem, PreContractFormValues } from '../schema/pre-contract.schema'

export function usePayload (
  form: PreContractFormValues,
  selectedCustomer: ICustomerById
): ICreatePreContractPayload {
  return {
    customerId: selectedCustomer.id!,
    employeeId: form.employeeId!,
    assets: form.assets.map(
      (c: IEstateFormItem): IEstateFormItem => ({
        assetType: c.assetType as TAssetType,
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
