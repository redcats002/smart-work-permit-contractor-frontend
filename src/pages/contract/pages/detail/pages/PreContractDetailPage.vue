<template>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <BaseActionMenu :items="actionMenuItems" />
    </BaseTop>
    <BasePage>
      <div
        v-if="isLoading"
        class="flex justify-center py-20">
        <Icon
          class="size-8 text-primary animate-spin"
          icon="mdi:loading" />
      </div>

      <div
        v-else-if="contract"
        class="flex flex-col gap-5 pb-10">
        <!-- Top info cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Customer info -->
          <BaseContainer class="md:col-span-2">
            <DisplayList :items="customerItems" />
          </BaseContainer>

          <!-- Contract status info -->
          <BaseContainer>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <span class="text-sm text-surface-500 w-24 shrink-0">สถานะ</span>
                <ChipAssetStatus :value="contract.assetStatus ?? undefined" />
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-surface-500 w-24 shrink-0">เลขที่สัญญา</span>
                <span class="text-surface-800">:{{ contract.idNo || '-' }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-surface-500 w-24 shrink-0">วันที่</span>
                <span class="text-surface-800">:{{ formatDate(contract.contractDate ?? undefined) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-surface-500 w-24 shrink-0">พนักงาน</span>
                <span class="text-surface-800">:{{ staffName }}</span>
              </div>
            </div>
          </BaseContainer>
        </div>

        <!-- Asset section -->
        <BaseContainer v-if="contract.assets.length">
          <div class="grid grid-cols-[200px_1fr] gap-6 min-h-80">
            <!-- Vertical tabs -->
            <div class="flex flex-col border-r border-surface-200 pr-4 gap-1">
              <button
                v-for="(col, i) in contract.assets"
                :key="col.id ?? i"
                :class="activeIndex === i
                  ? 'border-primary font-bold text-primary'
                  : 'border-transparent text-surface-500'"
                class="border-b-2 text-sm text-left py-2 hover:text-primary transition-colors"
                type="button"
                @click="activeIndex = i">
                หลักทรัพย์ที่{{ i + 1 }}
              </button>
            </div>

            <!-- Asset content -->
            <div
              v-if="activeAsset"
              class="flex flex-col gap-4">
              <div>
                <p class="font-bold text-surface-800">
                  {{ formatAssetType(activeAsset.assetType) }}
                  <span
                    v-if="activeAsset.detail"
                    class="text-surface-500 font-normal">
                    / {{ activeAsset.detail }}
                  </span>
                </p>
                <p
                  v-if="activeAsset.subDistrict || activeAsset.district || activeAsset.province"
                  class="text-sm text-surface-500 mt-1">
                  ต.{{ activeAsset.subDistrict }}
                  อ.{{ activeAsset.district }}
                  จ.{{ activeAsset.province }}
                  {{ activeAsset.postCode }}
                </p>
              </div>

              <button
                class="flex items-center gap-1.5 border border-surface-300 rounded-sm px-4 h-9
                  text-sm text-surface-700 hover:bg-surface-50 transition-colors w-fit"
                type="button"
                @click="openModal(activeAsset)">
                ใส่รายละเอียดสินทรัพย์
              </button>

              <!-- Images gallery -->
              <div
                v-if="activeAsset.images?.length"
                class="grid grid-cols-4 gap-3 mt-2">
                <div
                  v-for="img in activeAsset.images"
                  :key="img.id ?? img.url"
                  class="aspect-square rounded-md overflow-hidden border border-surface-200">
                  <img
                    :src="img.url"
                    class="size-full object-cover">
                </div>
              </div>
              <div
                v-else
                class="flex items-center justify-center h-48 bg-surface-50 rounded-md
                  border border-surface-200">
                <p class="text-sm text-surface-400">
                  ไม่มีข้อมูล
                </p>
              </div>
            </div>
          </div>
        </BaseContainer>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <ConfirmButton
            label="ขอราคาประเมิน"
            @click="onRequestAssessment()" />
          <SecondaryButton
            label="ยกเลิก"
            @click="onCancel()" />
        </div>
      </div>
    </BasePage>

    <!-- Asset detail modal -->
    <AssetDetailModal
      v-if="modalAsset"
      v-model="modalVisible"
      :asset="modalAsset"
      :contract-id="contractId"
      @saved="onAssetSaved()" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAssetDetailInfo, IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import { formatTitle as formatAssetTypeFn } from '@/enums/modules/contract/AssetType.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import { formatTitle as formatTitleName } from '@/enums/TitleName.enum'
import type { IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AssetDetailModal from '../components/AssetDetailModal.vue'
import { Icon } from '@iconify/vue'
import ChipAssetStatus from '../../list/components/ChipAssetStatus.vue'

const route = useRoute()
const router = useRouter()
const { formatDate, formatAge } = useDayjs()

const contractService: IPreContractProvider = new PreContractProvider()

const contractId = computed((): string | string[] => route.params.id)
const contract = ref<IPreContractById | null>(null)
const isLoading = ref<boolean>(false)

/* ─── Load ─── */

async function useFetch (): Promise<void> {
  const res = await contractService.getContractFindOne(contractId.value)
  contract.value = res.data
}

onMounted((): void => {
  handleLoading(useFetch, { loadingUnit: isLoading })
})

/* ─── Customer display ─── */

const customerItems = computed((): IDisplayList[] => {
  const c = contract.value?.customer
  if (!c) return []
  return [
    {
      key: 'name',
      label: 'ชื่อลูกค้า',
      value: formatter.fullName({
        titleName: (c.titleName ?? undefined) as TTitleName | undefined,
        firstName: c.firstName ?? undefined,
        lastName: c.lastName ?? undefined
      })
    },
    {
      key: 'idNo',
      label: 'เลขที่ลูกค้า',
      value: c.idNo || '-'
    },
    {
      key: 'idCard',
      label: 'เลขบัตรประชาชน',
      value: c.idCard ? formatter.thaiCitizenId(c.idCard) : '-'
    },
    {
      key: 'birthDate',
      label: 'วันเดือนปีเกิด',
      value: formatDate(c.birthDate ?? undefined)
    },
    {
      key: 'age',
      label: 'อายุ',
      value: c.birthDate ? formatAge(c.birthDate) : '-'
    },
    {
      key: 'customerGroup',
      label: 'กลุ่มลูกค้า',
      value: c.customerGroup?.name || '-'
    },
    {
      key: 'occupation',
      label: 'อาชีพ',
      value: c.occupation?.name || '-'
    },
    {
      key: 'phone',
      label: 'เบอร์โทร',
      value: formatter.fullPhoneNumber({
        phoneNumber: c.phoneNumber ?? undefined,
        phoneNumber2: c.phoneNumber2 ?? undefined
      })
    },
    {
      key: 'email',
      label: 'อีเมล',
      value: c.email || '-'
    }
  ]
})

const staffName = computed((): string => {
  const s = contract.value?.staff
  if (!s) return '-'
  const title = formatTitleName((s.titleName ?? undefined) as TTitleName | undefined)
  return `${title}${s.firstName} ${s.lastName}`.trim()
})

/* ─── Asset tabs ─── */

const activeIndex = ref<number>(0)
const activeAsset = computed(
  (): IAssetDetailInfo | null => contract.value?.assets[activeIndex.value] || null
)

function formatAssetType (type?: string | null): string {
  if (!type) return '-'
  return formatAssetTypeFn(type as TAssetType)
}

/* ─── Modal ─── */

const modalVisible = ref<boolean>(false)
const modalAsset = ref<IAssetDetailInfo | null>(null)

function openModal (asset: IAssetDetailInfo): void {
  modalAsset.value = asset
  modalVisible.value = true
}

async function onAssetSaved (): Promise<void> {
  await handleLoading(useFetch)
}

/* ─── Action menu ─── */

const actionMenuItems = computed((): IMenuItemAction[] => [
  {
    key: 'edit',
    type: 'TEXT',
    label: 'แก้ไขสัญญา',
    action: (): void => {
      router.push({ name: 'PreContractEditPage', params: { id: contractId.value } })
    }
  }
])

/* ─── Bottom actions ─── */

async function onRequestAssessment (): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    await contractService.requestAssessmentPrice(contractId.value)
    toast.success('ส่งคำขอราคาประเมินสำเร็จ')
    router.push({ name: 'ContractListPage' })
  })
}

function onCancel (): void {
  router.push({ name: 'ContractListPage' })
}
</script>
