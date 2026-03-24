import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { LandFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/land.schema'
import type { VehicleFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/vehicle.schema'

export interface IPreAssetList extends IEntity {
  images: IMedia[]
  type: TAssetType
  detail: string
  files: IMedia[]
  location: ILocationList
  realEstateForm: IRealEstateForm
  vehicleForm: IVehicleForm
}


interface ILocationList extends TBaseModel {}

interface IRealEstateForm extends LandFormValues {}

interface IVehicleForm extends VehicleFormValues {}
