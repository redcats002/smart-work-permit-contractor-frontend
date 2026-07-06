import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IUpdatePreAssetPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { IMedia } from '@/resources/provider/Upload.provider'
import useUpload from '@/composables/useUpload'
import type { ModalApartmentFormValues } from '../schema/apartment.schema'
import type { ModalLandFormValues } from '../schema/land.schema'
import { useInitForm } from '../schema/pre-asset.schema'
import type { ModalVehicleFormValues } from '../schema/vehicle.schema'

interface IUsePreAsset {
  formPreAsset: Ref<IUpdatePreAssetPayload>
  formKey: Ref<number>
  mount: () => void
  onUpdatePreAsset (preAssetId: TBaseParamsId): void
  onInitPreAsset (asset: IPreAssetList): void
}

export function usePreAsset (useFetch: () => Promise<void>): IUsePreAsset {
  const PreContractService: IPreContractProvider = new PreContractProvider()
  const formKey = ref<number>(0)

  const { getUploadImages } = useUpload()
  const formPreAsset = ref<IUpdatePreAssetPayload>(useInitForm())

  async function usePayload (): Promise<IUpdatePreAssetPayload> {
    return {
      ...formPreAsset.value,
      realEstateForm: {
        ...formPreAsset.value?.realEstateForm,
        landAreaNgan: formatter.numberParseFloat(formPreAsset.value?.realEstateForm?.landAreaNgan || 0),
        landAreaRai: formatter.numberParseFloat(formPreAsset.value?.realEstateForm?.landAreaRai || 0),
        landAreaSquareWah: formatter.numberParseFloat(formPreAsset.value?.realEstateForm?.landAreaSquareWah || 0)
      },
      apartmentCondoForm: {
        ...formPreAsset.value?.apartmentCondoForm,
        landAreaNgan: formatter.numberParseFloat(formPreAsset.value?.apartmentCondoForm?.landAreaNgan || 0),
        landAreaRai: formatter.numberParseFloat(formPreAsset.value?.apartmentCondoForm?.landAreaRai || 0),
        landAreaSquareWah: formatter.numberParseFloat(formPreAsset.value?.apartmentCondoForm?.landAreaSquareWah || 0),
        roomAreaSquareMeter: formatter.numberParseFloat(formPreAsset.value?.apartmentCondoForm?.roomAreaSquareMeter || 0),
        roomHeightMeter: formatter.numberParseFloat(formPreAsset.value?.apartmentCondoForm?.roomHeightMeter || 0)
      },
      images: await getUploadImages(formPreAsset.value.images as IMedia[])
    }
  }

  async function useUpdatePreAsset (preAssetId: TBaseParamsId): Promise<void> {
    const payload = await usePayload()
    await PreContractService.updatePreAsset(preAssetId, payload)
    toast.success('บันทึกข้อมูลหลักทรัพย์สำเร็จ')
    await useFetch()
  }

  function onUpdatePreAsset (preAssetId: TBaseParamsId): void {
    handleLoading((): Promise<void> => useUpdatePreAsset(preAssetId))
  }

  function onInitPreAsset (asset: IPreAssetList): void {
    function buildVehicleForm (): ModalVehicleFormValues {
      return {
        plateNo: asset.vehicleForm?.plateNo || '',
        province: asset.vehicleForm?.province || '',
        manufactureYear: asset.vehicleForm?.manufactureYear || '',
        registrationYear: asset.vehicleForm?.registrationYear || '',
        vehicleIdentificationNo: asset.vehicleForm?.vehicleIdentificationNo || '',
        mileage: asset.vehicleForm?.mileage || 0,
        type: asset?.type,
        detail: asset?.detail || ''
      }
    }

    function buildLandForm (): ModalLandFormValues {
      return {
        address: asset.realEstateForm?.address || '',
        subDistrict: asset.realEstateForm?.subDistrict || '',
        district: asset.realEstateForm?.district || '',
        province: asset.realEstateForm?.province || '',
        postCode: asset.realEstateForm?.postCode || '',
        urlGoogleMap: asset.realEstateForm?.urlGoogleMap || '',
        type: asset?.type,
        detail: asset?.detail || '',
        landNo: asset.realEstateForm?.landNo || '',
        surveyNo: asset.realEstateForm?.surveyNo || '',
        aerialPhotoMapNo: asset.realEstateForm?.aerialPhotoMapNo || '',
        aerialPhotoSheet: asset.realEstateForm?.aerialPhotoSheet || '',
        landAreaRai: asset.realEstateForm?.landAreaRai ?? 0,
        landAreaNgan: asset.realEstateForm?.landAreaNgan ?? 0,
        landAreaSquareWah: asset.realEstateForm?.landAreaSquareWah ?? 0
      }
    }

    function buildApartmentCondoForm (): ModalApartmentFormValues {
      return {
        address: asset.apartmentCondoForm?.address || '',
        subDistrict: asset.apartmentCondoForm?.subDistrict || '',
        district: asset.apartmentCondoForm?.district || '',
        province: asset.apartmentCondoForm?.province || '',
        postCode: asset.apartmentCondoForm?.postCode || '',
        urlGoogleMap: asset.apartmentCondoForm?.urlGoogleMap || '',
        type: asset?.type,
        detail: asset?.detail || '',
        buildingNumber: asset.apartmentCondoForm?.buildingNumber || '',
        floorNumber: asset.apartmentCondoForm?.floorNumber || '',
        buildingRegistrationNumber: asset.apartmentCondoForm?.buildingRegistrationNumber || '',
        commonPropertyOwnershipRatio: asset.apartmentCondoForm?.commonPropertyOwnershipRatio || '',
        landNo: asset.apartmentCondoForm?.landNo || '',
        roomAreaSquareMeter: asset.apartmentCondoForm?.roomAreaSquareMeter || 0,
        roomHeightMeter: asset.apartmentCondoForm?.roomHeightMeter || 0,
        unitNumber: asset.apartmentCondoForm?.unitNumber || '',
        buildingName: asset.apartmentCondoForm?.buildingName || '',
        landAreaRai: asset.apartmentCondoForm?.landAreaRai ?? 0,
        landAreaNgan: asset.apartmentCondoForm?.landAreaNgan ?? 0,
        landAreaSquareWah: asset.apartmentCondoForm?.landAreaSquareWah ?? 0
      }
    }

    const vehicleForm = buildVehicleForm()
    const realEstateForm = buildLandForm()
    const apartmentCondoForm = buildApartmentCondoForm()

    formPreAsset.value = {
      apartmentCondoForm,
      vehicleForm,
      realEstateForm,
      detail: asset.detail,
      type: asset.type,
      images: asset.images || []
    }
    mount()
  }

  function mount (): void {
    formKey.value++
  }

  return {
    formPreAsset,
    formKey,
    onUpdatePreAsset,
    onInitPreAsset,
    mount
  }
}
