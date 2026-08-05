import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { ApartmentFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/pre-asset/apartment.schema'
import type { LandFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/pre-asset/land.schema'
import type { VehicleFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/pre-asset/vehicle.schema'

export interface IPreAssetList extends IEntity {
  images: IMedia[]
  type: TAssetType
  detail: string
  files: IMedia[]
  location: ILocationList
  realEstateForm: IRealEstateForm
  vehicleForm: IVehicleForm
  apartmentCondoForm: IApartmentCondoForm
}


interface ILocationList extends TBaseModel {}

interface IRealEstateForm extends LandFormValues {}

interface IVehicleForm extends VehicleFormValues {}

interface IApartmentCondoForm extends ApartmentFormValues {}
