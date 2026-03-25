import { z } from 'zod'
import { PreAssetSchema as FormSchema } from '../../create/schema/pre-contract.schema'
import { ModalLandSchema } from './land.schema'
import { ModalVehicleSchema } from './vehicle.schema'

export const PreAssetUpdateSchema = z.object({
  ...FormSchema.shape,
  realEstateForm: ModalLandSchema,
  vehicleForm: ModalVehicleSchema
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
    }
  }
}
