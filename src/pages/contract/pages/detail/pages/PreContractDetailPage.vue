<template>
  <Teleport to="body">
    <ModalAssetDetail
      v-if="modalAsset"
      v-model="modalVisible"
      :asset="modalAsset"
      :contract-id="contractId"
      @saved="onAssetSaved()" />
  </Teleport>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <PreContractDetailMenuAction @edit="onEdit()" />
    </BaseTop>
    <BasePage>
      <div
        v-if="contract"
        class="flex flex-col gap-5 pb-10">
        <PreContractInformation :data="contract" />
        <AssetSection
          v-if="contract.assets.length"
          :active-asset="activeAsset"
          :active-index="activeIndex"
          :asset-category="assetCategory"
          :assets="contract.assets"
          @active="onActiveAsset($event)"
          @open="openModal($event)" />
        <FormAction
          :cancel-disabled="!filledAllRequired"
          :confirm-disabled="!filledAllRequired"
          confirm-label="ขอราคาประเมิน"
          @cancel="onCancel()"
          @confirm="onRequestPreContract()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAssetDetailInfo, IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import type { IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetSection from '../components/AssetSection.vue'
import ModalAssetDetail from '../components/ModalAssetDetail.vue'
import PreContractDetailMenuAction from '../components/PreContractDetailMenuAction.vue'
import PreContractInformation from '../components/PreContractInformation.vue'
import type { TAssetCategory } from '../../create/pages/PreContractCreatePage.vue'

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
  for (const e of (contract.value.assets)) {
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

async function useRequestPreContract (): Promise<void> {
  await PreContractService.requestAssessmentPrice(contractId.value)
  toast.success('ส่งคำขอราคาประเมินสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

async function useFetch (): Promise<void> {
  const mock = true // TODO: remove mock
  if (mock) {
    contract.value = {
      id: 1,
      idNo: 'PC-20240001',
      contractDate: '2024-06-01',
      status: 'DRAFT',
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
        phoneNumber2: null,
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
      startDate: ''
    }
    return
  }
  const res = await PreContractService.getContractFindOne(contractId.value)
  contract.value = res.data
}

function onRequestPreContract (): void {
  handleLoading(useRequestPreContract)
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

onMounted((): void => {
  handleLoading(useFetch)
})
</script>
