import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAssetDetailInfo, IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { TAssetCategory } from '../../create/pages/PreContractCreatePage.vue'

export interface IUseInitDetail {
  contractId: ComputedRef<string | string[]>
  contract: Ref<IPreContractById | null>
  activeAsset: ComputedRef<IAssetDetailInfo | null>
  activeIndex: Ref<number>
  modalVisible: Ref<boolean>
  modalAsset: Ref<IAssetDetailInfo | null>
  assetCategory: ComputedRef<TAssetCategory>
  filledAllRequired: ComputedRef<boolean>
  onAssetSaved(): void
  onEdit(): void
  onCancel(): void
  onActiveAsset(index: number): void
  openModal(asset: IAssetDetailInfo): void
  useFetch(): Promise<void>
  fetch(): void
}

export function useInitDetail (): IUseInitDetail {
  const route = useRoute()
  const router = useRouter()

  const PreContractService: IPreContractProvider = new PreContractProvider()

  const contractId = computed((): string | string[] => route.params.id)
  const contract = ref<IPreContractById | null>(null)

  const activeIndex = ref<number>(0)
  const activeAsset = computed((): IAssetDetailInfo | null => contract.value?.assets[activeIndex.value] || null)

  const modalVisible = ref<boolean>(false)
  const modalAsset = ref<IAssetDetailInfo | null>(null)

  const assetCategory = computed((): TAssetCategory => {
    if (!contract.value?.assets.length) return null
    for (const e of contract.value.assets) {
      if (isVehicleAsset(e.assetType)) return 'VEHICLE'
      if (isLandAsset(e.assetType)) return 'LAND'
    }
    return null
  })

  const filledAllRequired = computed((): boolean => {
    if (!contract.value) return false
    for (const asset of contract.value.assets) {
      if (isVehicleAsset(asset.assetType)) {
        if (!asset.vehicleProvince || !asset.yearManufactured || !asset.yearRegistered || !asset.chassisNumber || !asset.mileage) return false
      }
      if (isLandAsset(asset.assetType)) {
        if (!asset.landLocation || !asset.landNumber) return false
      }
    }
    return true
  })


  async function useFetch (): Promise<void> {
    const mock = true // TODO: remove mock
    if (mock) {
      contract.value = {
        id: 1,
        idNo: 'PC-20240001',
        contractDate: '2024-06-01',
        status: 'DRAFT', // TODO: change to see each state
        customer: {
          id: 1,
          titleName: 'MR',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          idNo: 'CUST-0001',
          idCard: '1101700201234',
          birthDate: '1980-05-15',
          customerGroup: { id: '1', name: 'กลุ่ม VIP' },
          occupation: { id: '1', name: 'พนักงานบริษัท' },
          phoneNumber: '0812345678',
          phoneNumber2: undefined,
          email: 'somchai@example.com'
        },
        amount: 50000,
        staff: { firstName: 'พนักงาน', lastName: 'ขาย', titleName: 'MS', id: 1 },
        assets: [
          {
            address: '123/45 หมู่บ้านสุขใจ ต.เมืองใหม่ อ.เมือง จ.ขอนแก่น 40000',
            assetType: route?.params?.id === '2' ? 'LAND_NS3K_WITHOUT_STRUCTURE' : 'VEHICLE_CAR',
            detail: 'โตโยต้า วีออส ปี 2015',
            aerialPhotoNumber: 'APN-001',
            subDistrict: 'เมืองใหม่',
            district: 'เมือง',
            province: 'ขอนแก่น',
            postCode: '40000',
            aerialPhotoSheet: 'แผ่นที่ 1',
            areaRai: 1,
            areaRgan: 2,
            areaTarangWa: 3,
            chassisNumber: 'CHS-1234567890',
            id: 1,
            landLocation: 'ที่ดินเปล่า',
            landNumber: 'LN-001',
            licensePlate: 'กข-1234',
            mileage: 75000,
            surveyPageNumber: 'SPN-001',
            urlGoogleMap: 'https://maps.google.com/?q=16.123456,102.123456',
            vehicleProvince: 'ขอนแก่น',
            yearManufactured: 2015,
            yearRegistered: 2015,
            images: [
              { fileUrl: 'https://placehold.co/400x400', originalName: 'รูปภาพหลักทรัพย์ 1', filePath: 'path/to/image1.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/500x400', originalName: 'รูปภาพหลักทรัพย์ 2', filePath: 'path/to/image2.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/600x400', originalName: 'รูปภาพหลักทรัพย์ 3', filePath: 'path/to/image3.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/700x400', originalName: 'รูปภาพหลักทรัพย์ 4', filePath: 'path/to/image4.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/800x400', originalName: 'รูปภาพหลักทรัพย์ 5', filePath: 'path/to/image5.jpg', fileType: 'image/jpeg' }
            ]
          },
          {
            address: '123/45 หมู่บ้านสุขใจ ต.เมืองใหม่ อ.เมือง จ.ขอนแก่น 40000',
            assetType: route?.params?.id === '2' ? 'LAND_NS3K_WITHOUT_STRUCTURE' : 'VEHICLE_CAR',
            detail: 'โตโยต้า วีออส ปี 2015',
            aerialPhotoNumber: 'APN-001',
            subDistrict: 'เมืองใหม่',
            district: 'เมือง',
            province: 'ขอนแก่น',
            postCode: '40000',
            aerialPhotoSheet: 'แผ่นที่ 1',
            areaRai: 1,
            areaRgan: 2,
            areaTarangWa: 3,
            chassisNumber: 'CHS-1234567890',
            id: 1,
            landLocation: 'ที่ดินเปล่า',
            landNumber: 'LN-001',
            licensePlate: 'กข-1234',
            mileage: 75000,
            surveyPageNumber: 'SPN-001',
            urlGoogleMap: 'https://maps.google.com/?q=16.123456,102.123456',
            vehicleProvince: 'ขอนแก่น',
            yearManufactured: 2015,
            yearRegistered: 2015,
            images: [
              { fileUrl: 'https://placehold.co/400x400', originalName: 'รูปภาพหลักทรัพย์ 1', filePath: 'path/to/image1.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/500x400', originalName: 'รูปภาพหลักทรัพย์ 2', filePath: 'path/to/image2.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/600x400', originalName: 'รูปภาพหลักทรัพย์ 3', filePath: 'path/to/image3.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/700x400', originalName: 'รูปภาพหลักทรัพย์ 4', filePath: 'path/to/image4.jpg', fileType: 'image/jpeg' },
              { fileUrl: 'https://placehold.co/800x400', originalName: 'รูปภาพหลักทรัพย์ 5', filePath: 'path/to/image5.jpg', fileType: 'image/jpeg' }
            ]
          }
        ],
        endDate: '',
        loanType: { id: 1, name: 'สินเชื่อทะเบียนรถ' },
        startDate: '',
        appraisals: [
          {
            detail: '',
            evaluators: [
              { evaluatorLevel: 'DISTRICT_LEVEL', id: 1, firstName: 'ผู้ตีราคา', lastName: 'ระดับอำเภอ', titleName: 'MR', loanAmount: 45000 },
              { evaluatorLevel: 'DISTRICT_LEVEL', id: 2, firstName: 'ผู้ตีราคา', lastName: 'ระดับจังหวัด', titleName: 'MS', loanAmount: 48000 },
              { evaluatorLevel: 'DISTRICT_LEVEL', id: 3, firstName: 'ผู้ตีราคา', lastName: 'ระดับภายนอก', titleName: 'MR', loanAmount: 47000 }
            ],
            evaluatorLevel: 'DISTRICT_LEVEL',
            id: 1
          },
          {
            detail: 'ลูกค้าอยากได้ 200,000 บาท',
            evaluators: [
              { evaluatorLevel: 'CEO_LEVEL', id: 1, firstName: 'ผู้ตีราคา', lastName: 'ระดับอำเภอ', titleName: 'MR', loanAmount: 45000 },
              { evaluatorLevel: 'CEO_LEVEL', id: 2, firstName: 'ผู้ตีราคา', lastName: 'ระดับจังหวัด', titleName: 'MS', loanAmount: 48000 },
              { evaluatorLevel: 'CEO_LEVEL', id: 3, firstName: 'ผู้ตีราคา', lastName: 'ระดับภายนอก', titleName: 'MR', loanAmount: 47000 }
            ],
            evaluatorLevel: 'CEO_LEVEL',
            id: 2
          }
        ]
      }
      return
    }
    const res = await PreContractService.getContractFindOne(contractId.value)
    contract.value = res.data
  }

  function onAssetSaved (): void {
    handleLoading(useFetch)
  }

  function onEdit (): void {
    router.push({ name: 'PreContractEditPage', params: { id: contractId.value } })
  }

  function onCancel (): void {
    router.push({ name: 'ContractListPage' })
  }

  function onActiveAsset (index: number): void {
    activeIndex.value = index
  }

  function openModal (asset: IAssetDetailInfo): void {
    modalAsset.value = asset
    modalVisible.value = true
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    activeIndex,
    activeAsset,
    assetCategory,
    contract,
    contractId,
    filledAllRequired,
    modalAsset,
    modalVisible,
    useFetch,
    fetch,
    onActiveAsset,
    onCancel,
    onEdit,
    onAssetSaved,
    openModal
  }
}
