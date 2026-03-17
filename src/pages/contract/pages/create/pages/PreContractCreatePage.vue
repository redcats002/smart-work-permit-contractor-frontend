<template>
  <section id="pre-contract-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ConfirmButton
        label="Auto"
        @click="onAuto()" />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <BaseContainer>
          <LabelField
            :invalid="!selectedCustomer"
            label="หน้างานประเมิน"
            name="sellManId"
            required>
            <EmployeeSelection
              v-model="form.sellManId"
              name="sellManId"
              placeholder="เลือกหน้างานประเมิน" />
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
                placeholder="เลือกลูกค้า"
                @update:model-value="onCustomerSelect($event)" />
            </LabelField>
            <CustomerCard
              v-if="selectedCustomer"
              :data="selectedCustomer" />
          </div>
        </BaseContainer>
        <AssetFormSection
          v-for="(item, index) in form.preAssets"
          :key="item.key"
          v-model="form.preAssets[index]"
          :asset-category="assetCategory"
          :form="$form"
          :name-prefix="`preAssets.${index}`"
          @delete="onRemoveAsset(index)" />
        <Button
          v-show="canAddAsset"
          class="flex items-center justify-start gap-1.5 py-4 text-sm text-primary! font-medium hover:opacity-80
            transition-opacity bg-white!"
          type="button"
          fluid
          text
          @click="onAddAsset()">
          <Icon
            class="size-5"
            icon="mdi:plus" />
          เพิ่มหลักทรัพย์ในสัญญา
        </Button>
        <div class="flex gap-3 flex-wrap">
          <ConfirmButton
            label="ยืนยัน/สั่งงานประเมิน"
            type="submit"
            @click="setSubmitMode('PENDING_EVALUATION')" />
          <Button
            class="bg-white! text-[#333333]! border-gray-400! flex items-center hover:bg-gray-100! w-49.5"
            label="ร่าง"
            type="submit"
            outlined
            @click="setSubmitMode('DRAFT')" />
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
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import type { IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerSelection from '@/components/selection/modules/customer/CustomerSelection.vue'
import EmployeeSelection from '@/components/selection/modules/employee/EmployeeSelection.vue'
import AssetFormSection from '../components/AssetFormSection.vue'
import CustomerCard from '../components/CustomerCard.vue'
import { Icon } from '@iconify/vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import type { PreContractFormValues, TAssetCategory } from '../schema/pre-contract.schema'
import { createPreAssetBase, PreContractSchema, useDev, useFormInitialValues } from '../schema/pre-contract.schema'

const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()
const ContractService: IPreContractProvider = new PreContractProvider()

const formKey = ref<number>(0)
const form = ref<PreContractFormValues>(useFormInitialValues())
const resolver = zodResolver(PreContractSchema)
const submitMode = ref<TPreContractStatus>('DRAFT')
const selectedCustomer = ref<ICustomerById | null>(null)

const assetCategory = computed((): TAssetCategory => {
  for (const e of form.value.preAssets) {
    if (isVehicleAsset(e.type)) return 'VEHICLE'
    if (isLandAsset(e.type)) return 'LAND'
  }
  return null
})

const canAddAsset = computed((): boolean => {
  if (!assetCategory.value) return false
  return assetCategory.value !== 'VEHICLE'
})

async function onCustomerSelect (id?: number | null): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    if (!id) return
    const res = await CustomerService.getCustomerFindOne(Number(id))
    selectedCustomer.value = res.data
  })
}

async function useSubmit (): Promise<void> {
  await ContractService.createContract(usePayload({ ...form.value, status: submitMode.value }, selectedCustomer.value!))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

function onSubmit (event: FormSubmitEvent): void {
  console.log(event)
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(useSubmit)
}


function onAddAsset (): void {
  if (!canAddAsset.value) return
  form.value.preAssets.push(createPreAssetBase())
}

function onRemoveAsset (index: number): void {
  if (form.value.preAssets.length <= 1) return
  form.value.preAssets.splice(index, 1)
}

function onCancel (): void {
  router.push({ name: 'ContractListPage' })
}

function setSubmitMode (mode: TPreContractStatus): void {
  submitMode.value = mode
}

function onAuto (): void {
  form.value = { ...useDev() }
  formKey.value++
  onCustomerSelect(form.value.customerId)
}

</script>
