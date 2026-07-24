import { computed, type ComputedRef, type Ref } from 'vue'
import { formatter } from '@/utils/Formatter'
import { isApartmentAsset, isLandAllAsset, isTitleDeedAsset, type TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { IDisplayList } from '@/components/display/DisplayList.vue'

interface IRealEstateFormInput {
  landNo?: string
  surveyNo?: string
  titleDeedNo?: string
  address?: string
  subDistrict?: string
  district?: string
  province?: string
  postCode?: string
  urlGoogleMap?: string
  aerialPhotoMapNo?: string
  aerialPhotoSheet?: string
}

interface IVehicleFormInput {
  plateNo?: string
  manufactureYear?: string
  registrationYear?: string
  vehicleIdentificationNo?: string
  mileage?: number
}

interface IApartmentFormInput {
  landNo?: string
  address?: string
  subDistrict?: string
  district?: string
  province?: string
  postCode?: string
  urlGoogleMap?: string
  landAreaRai?: number
  landAreaNgan?: number
  landAreaSquareWah?: number
  unitNumber?: string
  floorNumber?: string
  buildingNumber?: string
  buildingName?: string
  buildingRegistrationNumber?: string
  roomAreaSquareMeter?: number
  roomHeightMeter?: number
  commonPropertyOwnershipRatio?: string
}

export interface IAssetDisplayItemsInput {
  type?: TAssetType | string | null
  detail?: string | null
  locationName?: string | null
  realEstateForm?: IRealEstateFormInput | null
  vehicleForm?: IVehicleFormInput | null
  apartmentForm?: IApartmentFormInput | null
}

export function useAssetDisplayItems (asset: Ref<IAssetDisplayItemsInput | null | undefined>): ComputedRef<IDisplayList[]> {
  return computed((): IDisplayList[] => {
    const data = asset.value
    if (isLandAllAsset(data?.type)) {
      const realEstateForm = data?.realEstateForm
      const fullAddress = formatter.fullAddress({
        address: realEstateForm?.address || '',
        subDistrict: realEstateForm?.subDistrict || '',
        district: realEstateForm?.district || '',
        province: realEstateForm?.province || '',
        postCode: realEstateForm?.postCode || '',
        urlGoogleMap: realEstateForm?.urlGoogleMap || ''
      })
      if (isTitleDeedAsset(data?.type)) {
        return [
          { label: 'เลขที่ดิน', value: realEstateForm?.landNo || '-', key: 'landNo', hidden: !realEstateForm?.landNo },
          { label: 'หน้าสำรวจ', value: realEstateForm?.surveyNo || '-', key: 'surveyNo', hidden: !realEstateForm?.surveyNo },
          { label: 'โฉนดเลขที่', value: realEstateForm?.titleDeedNo || '-', key: 'titleDeedNo', hidden: !realEstateForm?.titleDeedNo },
          { label: 'ที่อยู่หลักทรัพย์', value: fullAddress, key: 'address', extUrl: realEstateForm?.urlGoogleMap || '', hidden: !fullAddress },
          { label: 'ระวางรูปถ่ายทางอากาศ', value: `${realEstateForm?.aerialPhotoSheet || '-'}`, key: 'aerialPhotoSheet', hidden: !realEstateForm?.aerialPhotoSheet },
          { label: 'จุดจัดเก็บ', value: data?.locationName, key: 'location', hidden: !data?.locationName }
        ]
      }

      return [
        { label: 'เลขที่ดิน', value: realEstateForm?.landNo || '-', key: 'landNo', hidden: !realEstateForm?.landNo },
        { label: 'หน้าสำรวจ', value: realEstateForm?.surveyNo || '-', key: 'surveyNo', hidden: !realEstateForm?.surveyNo },
        { label: 'ที่อยู่หลักทรัพย์', value: fullAddress, key: 'address', extUrl: realEstateForm?.urlGoogleMap || '', hidden: !fullAddress },
        { label: 'ระวางรูปถ่ายทางอากาศ', value: `หมายเลข ${realEstateForm?.aerialPhotoMapNo || '-'} แผ่นที่ ${realEstateForm?.aerialPhotoSheet || '-'}`, key: 'aerialPhotoMapNo', hidden: !realEstateForm?.aerialPhotoMapNo && !realEstateForm?.aerialPhotoSheet },
        { label: 'จุดจัดเก็บ', value: data?.locationName, key: 'location', hidden: !data?.locationName }
      ]
    }
    if (isApartmentAsset(data?.type)) {
      const apartmentForm = data?.apartmentForm
      const fullAddress = formatter.fullAddress({
        address: apartmentForm?.address || '',
        subDistrict: apartmentForm?.subDistrict || '',
        district: apartmentForm?.district || '',
        province: apartmentForm?.province || '',
        postCode: apartmentForm?.postCode || ''
      })
      const location = [apartmentForm?.landNo, fullAddress].filter(Boolean).join(', ')
      const landArea = [
        apartmentForm?.landAreaRai ? `${apartmentForm.landAreaRai} ไร่` : '',
        apartmentForm?.landAreaNgan ? `${apartmentForm.landAreaNgan} งาน` : '',
        apartmentForm?.landAreaSquareWah ? `${apartmentForm.landAreaSquareWah} ตารางวา` : ''
      ].filter(Boolean).join(' ')
      return [
        { label: 'ตำแหน่งที่ดิน', value: location || '-', key: 'landNo', extUrl: apartmentForm?.urlGoogleMap || '', hidden: !location },
        { label: 'เนื้อที่', value: landArea || '-', key: 'landArea', hidden: !landArea },
        { label: 'ห้องชุดเลขที่', value: apartmentForm?.unitNumber || '-', key: 'unitNumber', hidden: !apartmentForm?.unitNumber },
        { label: 'ชั้นที่', value: apartmentForm?.floorNumber || '-', key: 'floorNumber', hidden: !apartmentForm?.floorNumber },
        { label: 'อาคารเลขที่', value: apartmentForm?.buildingNumber || '-', key: 'buildingNumber', hidden: !apartmentForm?.buildingNumber },
        { label: 'ชื่ออาคารชุด', value: apartmentForm?.buildingName || '-', key: 'buildingName', hidden: !apartmentForm?.buildingName },
        { label: 'ทะเบียนอาคารชุดเลขที่', value: apartmentForm?.buildingRegistrationNumber || '-', key: 'buildingRegistrationNumber', hidden: !apartmentForm?.buildingRegistrationNumber },
        { label: 'เนื้อที่ห้อง', value: `เนื้อที่ ${apartmentForm?.roomAreaSquareMeter || '-'} ตารางเมตร, สูง ${apartmentForm?.roomHeightMeter || '-'} เมตร`, key: 'roomAreaSquareMeter', hidden: !apartmentForm?.roomAreaSquareMeter && !apartmentForm?.roomHeightMeter },
        { label: 'อัตราส่วนแห่งกรรมสิทธิ์ในทรัพย์ส่วนกลาง', value: apartmentForm?.commonPropertyOwnershipRatio || '-', key: 'commonPropertyOwnershipRatio', hidden: !apartmentForm?.commonPropertyOwnershipRatio },
        { label: 'จุดจัดเก็บ', value: data?.locationName, key: 'location', hidden: !data?.locationName }
      ]
    }

    const vehicleForm = data?.vehicleForm
    return [
      { label: 'รายละเอียดหลักทรัพย์', value: data?.detail || '-', key: 'detail', hidden: !data?.detail },
      { label: 'เลขทะเบียนรถ', value: vehicleForm?.plateNo || '-', key: 'plateNo', hidden: !vehicleForm?.plateNo },
      { label: 'ปีที่ผลิต', value: vehicleForm?.manufactureYear || '-', key: 'manufactureYear', hidden: !vehicleForm?.manufactureYear },
      { label: 'ปีที่จดทะเบียน', value: vehicleForm?.registrationYear || '-', key: 'registrationYear', hidden: !vehicleForm?.registrationYear },
      { label: 'หมายเลขตัวถัง', value: vehicleForm?.vehicleIdentificationNo || '-', key: 'vehicleIdentificationNo', hidden: !vehicleForm?.vehicleIdentificationNo },
      { label: 'เลขไมล์ (กม.)', value: vehicleForm?.mileage || '-', key: 'mileage', hidden: !vehicleForm?.mileage },
      { label: 'จุดจัดเก็บ', value: data?.locationName, key: 'location', hidden: !data?.locationName }
    ]
  })
}
