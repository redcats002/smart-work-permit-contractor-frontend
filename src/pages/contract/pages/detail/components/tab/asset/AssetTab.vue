<template>
  <div class="grid gap-2.5">
    <AssetSection
      v-if="contract?.assets.length"
      :active-asset="activeAsset"
      :active-index="activeIndex"
      :asset-category="assetCategory"
      :assets="contract.assets"
      :status="contract?.status"
      @active="onActiveAsset($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAssetDetailInfo, IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { TAssetCategory } from '@/pages/contract/pages/create/pages/PreContractCreatePage.vue'
import AssetSection from '@/pages/contract/pages/pre-contract-detail/components/AssetSection.vue'

const route = useRoute()

const PreContractService: IPreContractProvider = new PreContractProvider()

const contractId = computed((): string | string[] => route.params.id)
const contract = ref<IPreContractById | null>(null)

const activeIndex = ref<number>(0)
const activeAsset = computed((): IAssetDetailInfo | null => {
  if (!contract.value?.assets?.[activeIndex.value]) return null
  return contract.value?.assets?.[activeIndex.value]
})

const assetCategory = computed((): TAssetCategory => {
  if (!contract.value?.assets.length) return null
  for (const e of contract.value.assets) {
    if (isVehicleAsset(e.assetType)) return 'VEHICLE'
    if (isLandAsset(e.assetType)) return 'LAND'
  }
  return null
})

async function useFetch (): Promise<void> {
  const mock = true // TODO: remove mock
  if (mock) {
    contract.value = {
      id: 1,
      idNo: 'PC-20240001',
      contractDate: '2024-06-01',
      status: 'DONE', // TODO: change to see each state
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
          assetType: 'LAND_NS3K_WITHOUT_STRUCTURE', // TODO: change to mock asset type,
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
          assetType: 'LAND_NS3K_WITH_STRUCTURE', // TODO: change to mock asset type,
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


function onActiveAsset (index: number): void {
  activeIndex.value = index
}

function fetch (): void {
  handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
