<template>
  <section id="pre-contract-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <Form
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <BaseContainer>
          <LabelField
            :invalid="!selectedCustomer"
            label="หน้างานประเมิน "
            name="employeeId"
            tag="div"
            required>
            <EmployeeSelection
              v-model="form.employeeId"
              name="employeeId" />
          </LabelField>
        </BaseContainer>
        <BaseContainer>
          <div class="flex flex-col gap-4">
            <LabelField
              :invalid="!selectedCustomer"
              label="ลูกค้า"
              name="customerId"
              tag="div"
              required>
              <CustomerSelection
                v-model="form.customerId"
                name="customerId"
                @update:model-value="onCustomerSelect($event)" />
            </LabelField>
            <CustomerCard
              v-if="selectedCustomer"
              :data="selectedCustomer" />
          </div>
        </BaseContainer>
        <EstateFormSection
          v-for="(item, index) in form.assets"
          :key="item.key"
          v-model="form.assets[index]"
          :estate-category="estateCategory"
          :form="$form"
          :name-prefix="`estates.${index}`"
          @delete="onRemoveEstate(index)" />
        <Button
          v-show="canAddEstate"
          class="flex items-center justify-start gap-1.5 py-4 text-sm text-primary! font-medium hover:opacity-80
            transition-opacity bg-white!"
          type="button"
          fluid
          text
          @click="onAddEstate()">
          <Icon
            class="size-5"
            icon="mdi:plus" />
          เพิ่มหลักทรัพย์ในสัญญา
        </Button>
        <div class="flex gap-3 flex-wrap">
          <ConfirmButton
            label="ยืนยัน/สั่งงานประเมิน"
            type="submit"
            @click="submitMode = 'PENDING'" />
          <Button
            class="bg-white! text-[#333333]! border-gray-400! flex items-center hover:bg-gray-100! w-49.5"
            label="ร่าง"
            type="submit"
            outlined
            @click="submitMode = 'DRAFT'" />
          <Button
            class="w-49.5"
            label="ยกเลิก"
            outlined
            @click="onCancel()" />
        </div>
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TAssetAssessmentStatus } from '@/enums/modules/contract/AssetAssessmentStatus.enum'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import type { IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerSelection from '@/components/selection/modules/customer/CustomerSelection.vue'
import EmployeeSelection from '@/components/selection/modules/employee/EmployeeSelection.vue'
import CustomerCard from '../components/CustomerCard.vue'
import EstateFormSection from '../components/EstateFormSection.vue'
import { Icon } from '@iconify/vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import type { PreContractFormValues } from '../schema/pre-contract.schema'
import { createEstateItem, PreContractSchema, useFormInitialValues } from '../schema/pre-contract.schema'

type TEstateCategory = 'VEHICLE' | 'LAND' | null

const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()
const ContractService: IPreContractProvider = new PreContractProvider()

const form = ref<PreContractFormValues>(useFormInitialValues())
const resolver = zodResolver(PreContractSchema)
const submitMode = ref<TAssetAssessmentStatus>('PENDING')
const selectedCustomer = ref<ICustomerById | null>(null)

const estateCategory = computed((): TEstateCategory => {
  for (const e of form.value.assets) {
    if (isVehicleAsset(e.assetType)) return 'VEHICLE'
    if (isLandAsset(e.assetType)) return 'LAND'
  }
  return null
})

const canAddEstate = computed((): boolean => {
  if (!estateCategory.value) return false
  return estateCategory.value !== 'VEHICLE'
})

async function onCustomerSelect (id?: number | null): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    if (!id) return
    const res = await CustomerService.getCustomerFindOne(Number(id))
    selectedCustomer.value = res.data
  })
}

async function useSubmit (): Promise<void> {
  await ContractService.createContract(usePayload(form.value, selectedCustomer.value!, submitMode.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(useSubmit)
}


function onAddEstate (): void {
  if (!canAddEstate.value) return
  form.value.assets.push(createEstateItem())
}

function onRemoveEstate (index: number): void {
  if (form.value.assets.length <= 1) return
  form.value.assets.splice(index, 1)
}


function onCancel (): void {
  router.push({ name: 'ContractListPage' })
}
</script>
