import { z } from 'zod'
import { PreAssetSchema as FormSchema } from '../../../create/schema/pre-contract.schema'
import { ModalApartmentSchema } from './apartment.schema'
import { ModalLandSchema } from './land.schema'
import { ModalVehicleSchema } from './vehicle.schema'

export const PreAssetUpdateSchema = z.object({
  ...FormSchema.shape,
  realEstateForm: ModalLandSchema,
  vehicleForm: ModalVehicleSchema,
  apartmentCondoForm: ModalApartmentSchema
})

export type PreAssetUpdateValues = z.infer<typeof PreAssetUpdateSchema>

export function useInitForm (): PreAssetUpdateValues {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: '',
    detail: '',
    images: [],
    // Land fields
    realEstateForm: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      aerialPhotoMapNo: '',
      aerialPhotoSheet: '',
      detail: '',
      landAreaNgan: 0,
      landAreaRai: 0,
      type: '',
      landNo: '',
      surveyNo: '',
      titleDeedNo: '',
      landAreaSquareWah: 0
    },
    // Vehicle fields
    vehicleForm: {
      plateNo: '',
      province: '',
      manufactureYear: '',
      registrationYear: '',
      vehicleIdentificationNo: '',
      mileage: 0,
      type: '',
      detail: ''
    },
    // Apartment/Condo fields
    apartmentCondoForm: {
      type: '',
      detail: '',
      landNo: '',
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      landAreaRai: 0,
      landAreaNgan: 0,
      landAreaSquareWah: 0,
      unitNumber: '',
      floorNumber: '',
      buildingNumber: '',
      buildingName: '',
      buildingRegistrationNumber: '',
      roomAreaSquareMeter: 0,
      roomHeightMeter: 0,
      commonPropertyOwnershipRatio: ''
    }
  }
}
