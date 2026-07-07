import type { IUpdatePreContractPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import { type TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { PreAssetFormValues, PreContractFormValues } from '../../create/schema/pre-contract.schema'

export function usePayload (form: PreContractFormValues, selectedCustomer: ICustomerById): IUpdatePreContractPayload {
  return {
    customerId: selectedCustomer.id!,
    sellManId: form.sellManId!,
    status: form.status!,
    preAssets: form.preAssets.map(
      (c: PreAssetFormValues): PreAssetFormValues => ({
        type: c.type as TAssetType,
        detail: c.detail,
        images: c.images,
        // Land fields
        realEstateForm: {
          landNo: c.realEstateForm?.landNo || '',
          surveyNo: c.realEstateForm?.surveyNo || '',
          address: c.realEstateForm?.address || '',
          subDistrict: c.realEstateForm?.subDistrict || '',
          district: c.realEstateForm?.district || '',
          province: c.realEstateForm?.province || '',
          postCode: c.realEstateForm?.postCode || '',
          urlGoogleMap: c.realEstateForm?.urlGoogleMap || '',
          aerialPhotoMapNo: c.realEstateForm?.aerialPhotoMapNo || '',
          aerialPhotoSheet: c.realEstateForm?.aerialPhotoSheet || '',
          landAreaNgan: c.realEstateForm?.landAreaNgan || 0,
          landAreaRai: c.realEstateForm?.landAreaRai || 0,
          landAreaSquareWah: c.realEstateForm?.landAreaSquareWah || 0
        },
        // Vehicle fields
        vehicleForm: {
          brand: c.vehicleForm?.brand || '',
          model: c.vehicleForm?.model || '',
          color: c.vehicleForm?.color || '',
          plateNo: c.vehicleForm?.plateNo || '',
          province: c.vehicleForm?.province || '',
          manufactureYear: c.vehicleForm?.manufactureYear || '',
          registrationYear: c.vehicleForm?.registrationYear || '',
          vehicleIdentificationNo: c.vehicleForm?.vehicleIdentificationNo || '',
          engineNumber: c.vehicleForm?.engineNumber || '',
          mileage: c.vehicleForm?.mileage || 0
        },
        // Apartment/Condo fields
        apartmentCondoForm: {
          landNo: c.apartmentCondoForm?.landNo || '',
          address: c.apartmentCondoForm?.address || '',
          subDistrict: c.apartmentCondoForm?.subDistrict || '',
          district: c.apartmentCondoForm?.district || '',
          province: c.apartmentCondoForm?.province || '',
          postCode: c.apartmentCondoForm?.postCode || '',
          urlGoogleMap: c.apartmentCondoForm?.urlGoogleMap || '',
          landAreaRai: c.apartmentCondoForm?.landAreaRai || 0,
          landAreaNgan: c.apartmentCondoForm?.landAreaNgan || 0,
          landAreaSquareWah: c.apartmentCondoForm?.landAreaSquareWah || 0,
          unitNumber: c.apartmentCondoForm?.unitNumber || '',
          floorNumber: c.apartmentCondoForm?.floorNumber || '',
          buildingNumber: c.apartmentCondoForm?.buildingNumber || '',
          buildingName: c.apartmentCondoForm?.buildingName || '',
          buildingRegistrationNumber: c.apartmentCondoForm?.buildingRegistrationNumber || '',
          roomAreaSquareMeter: c.apartmentCondoForm?.roomAreaSquareMeter || 0,
          roomHeightMeter: c.apartmentCondoForm?.roomHeightMeter || 0,
          commonPropertyOwnershipRatio: c.apartmentCondoForm?.commonPropertyOwnershipRatio || ''
        }
      })
    )
  }
}
