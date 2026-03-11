<template>
  <section>
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <div class="flex flex-col gap-5 pb-10">
        <!-- Assessment Staff Section -->
        <BaseContainer>
          <div class="mb-1.5">
            <span class="text-sm font-bold">
              หน้างานประเมิน
              <span class="text-red-500">*</span>
            </span>
          </div>
          <div
            class="flex items-center gap-2.5 border border-surface-300 rounded-sm px-3 h-9 bg-surface-50">
            <Icon
              class="text-surface-500 size-4 shrink-0"
              icon="solar:user-bold" />
            <span class="text-sm text-surface-800">{{ assessorName }}</span>
          </div>
        </BaseContainer>

        <!-- Customer Section -->
        <BaseContainer>
          <div class="flex flex-col gap-4">
            <LabelField
              label="ลูกค้า"
              tag="div"
              required>
              <AutoCompleteInput
                v-model="customerInput"
                :suggestions="customerSuggestions"
                option-label="displayName"
                placeholder="ค้นหาลูกค้า"
                force-selection
                @complete="onCustomerSearch($event)"
                @item-select="onCustomerSelect($event)" />
            </LabelField>

            <!-- Customer Details Card -->
            <div
              v-if="selectedCustomer"
              class="border border-surface-200 rounded-md p-4 space-y-2.5">
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">สถานะ</span>
                <BaseChip
                  :append-icon="getCustomerStatusIcon(selectedCustomer.status)"
                  :label="formatCustomerStatusTitle(selectedCustomer.status)"
                  :wrapper-class="getCustomerStatusClass(selectedCustomer.status)" />
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">เลขที่ลูกค้า</span>
                <span class="text-surface-800">:{{ selectedCustomer.idNo || '-' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">เลขบัตรประชาชน</span>
                <span class="text-surface-800">:{{ formatter.thaiCitizenId(selectedCustomer.idCard) }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">วันเกิด</span>
                <span class="text-surface-800">:{{ formatDate(selectedCustomer.birthDate ?? undefined) }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">อายุ</span>
                <span class="text-surface-800">:{{ customerAge }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">กลุ่มลูกค้า</span>
                <span class="text-surface-800">:{{ selectedCustomer.customerGroup?.name || '-' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">อาชีพ</span>
                <span class="text-surface-800">:{{ selectedCustomer.occupation?.name || '-' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">เบอร์โทร</span>
                <span class="text-surface-800">
                  :{{ formatter.fullPhoneNumber({
                    phoneNumber: selectedCustomer.phoneNumber,
                    phoneNumber2: selectedCustomer.phoneNumber2
                  }) }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-40 shrink-0">อีเมล</span>
                <span class="text-surface-800">:{{ selectedCustomer.email || '-' }}</span>
              </div>
            </div>
          </div>
        </BaseContainer>

        <!-- Collateral Sections -->
        <CollateralFormSection
          v-for="(item, index) in collaterals"
          :key="item.key"
          v-model="collaterals[index]"
          @delete="removeCollateral(index)" />

        <!-- Add Collateral Button -->
        <button
          class="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80
            transition-opacity w-fit"
          type="button"
          @click="addCollateral()">
          <Icon
            class="size-5"
            icon="mdi:plus-circle-outline" />
          เพิ่มหลักทรัพย์ในสัญญา
        </button>

        <!-- Action Buttons -->
        <div class="flex gap-3 flex-wrap">
          <ConfirmButton
            label="ยืนยัน/ส่งงานประเมิน"
            @click="onSubmitPending()" />
          <SecondaryButton
            label="ร่าง"
            @click="onSaveDraft()" />
          <SecondaryButton
            label="ยกเลิก"
            @click="onCancel()" />
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICollateralItem } from '@/models/request/contract/ContractReq.model'
import type { ICustomerById, ICustomerList } from '@/models/response/customer/CustomerRes.model'
import type { TCollateralAssessmentStatus } from '@/enums/modules/contract/CollateralAssessmentStatus.enum'
import {
  formatTitle as formatCustomerStatusTitle,
  getIcon as getCustomerStatusIcon,
  getStatusClass as getCustomerStatusClass
} from '@/enums/modules/customer/CustomerStatus.enum'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import BaseChip from '@/components/chip/BaseChip.vue'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CollateralFormSection, { type ICollateralFormItem } from '../components/CollateralFormSection.vue'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const { formatDate } = useDayjs()

const customerService: ICustomerProvider = new CustomerProvider()
const contractService: IContractProvider = new ContractProvider()

/* ─── Assessment staff ─── */

const assessorName = computed((): string => {
  const { firstName, lastName } = authStore.user
  return `${firstName} ${lastName}`.trim() || 'ไม่ระบุ'
})

/* ─── Customer search ─── */

interface ICustomerSuggestion extends ICustomerList {
  displayName: string
}

const customerInput = ref<ICustomerSuggestion | string | null>(null)
const customerSuggestions = ref<ICustomerSuggestion[]>([])
const selectedCustomer = ref<ICustomerById | null>(null)

const customerAge = computed((): string => {
  if (!selectedCustomer.value?.birthDate) return '-'
  return String(dayjs().diff(dayjs(selectedCustomer.value.birthDate), 'year'))
})

async function onCustomerSearch (event: { query: string }): Promise<void> {
  const res = await customerService.getCustomerPaginate({
    search: event.query,
    limit: 10
  })
  customerSuggestions.value = (res.data || []).map((c: ICustomerList): ICustomerSuggestion => ({
    ...c,
    displayName: formatter.fullName({
      titleName: c.titleName,
      firstName: c.firstName,
      lastName: c.lastName
    })
  }))
}

async function onCustomerSelect (event: { value: ICustomerSuggestion }): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    const res = await customerService.getCustomerFindOne(event.value.id!)
    selectedCustomer.value = res.data
  })
}

/* ─── Collaterals ─── */

function createCollateral (): ICollateralFormItem {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    collateralType: '',
    detail: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    urlGoogleMap: ''
  }
}

const collaterals = ref<ICollateralFormItem[]>([createCollateral()])

function addCollateral (): void {
  collaterals.value.push(createCollateral())
}

function removeCollateral (index: number): void {
  if (collaterals.value.length <= 1) return
  collaterals.value.splice(index, 1)
}

/* ─── Submit ─── */

async function submitPayload (collateralStatus: TCollateralAssessmentStatus): Promise<void> {
  await contractService.createContract({
    customerId: selectedCustomer.value!.id!,
    collateralStatus,
    collaterals: collaterals.value.map(
      (c: ICollateralFormItem): ICollateralItem => ({
        collateralType: c.collateralType,
        detail: c.detail,
        address: c.address,
        subDistrict: c.subDistrict,
        district: c.district,
        province: c.province,
        postCode: c.postCode,
        urlGoogleMap: c.urlGoogleMap
      })
    )
  })
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

async function onSubmit (collateralStatus: TCollateralAssessmentStatus): Promise<void> {
  if (!selectedCustomer.value?.id) {
    toast.error('กรุณาเลือกลูกค้า')
    return
  }
  await handleLoading((): Promise<void> => submitPayload(collateralStatus))
}

function onSubmitPending (): void {
  onSubmit('PENDING')
}

function onSaveDraft (): void {
  onSubmit('DRAFT')
}

function onCancel (): void {
  router.push({ name: 'ContractListPage' })
}
</script>
