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
          v-for="(item, index) in form.estates"
          :key="item.key"
          v-model="form.estates[index]"
          :form="$form"
          :name-prefix="`estates.${index}`"
          @delete="onRemoveEstate(index)" />
        <Button
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
            label="ยืนยัน"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IEstateItem } from '@/models/request/contract/ContractReq.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TEstateAssessmentStatus } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
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
import type { IEstateFormItem, PreContractFormValues } from '../schema/pre-contract.schema'
import { createEstateItem, PreContractSchema, useFormInitialValues } from '../schema/pre-contract.schema'

const router = useRouter()

const CustomerService: ICustomerProvider = new CustomerProvider()
const ContractService: IContractProvider = new ContractProvider()

const form = ref<PreContractFormValues>(useFormInitialValues())
const resolver = zodResolver(PreContractSchema)
const submitMode = ref<TEstateAssessmentStatus>('PENDING')
const selectedCustomer = ref<ICustomerById | null>(null)

async function onCustomerSelect (id?: number | null): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    if (!id) return
    const res = await CustomerService.getCustomerFindOne(Number(id))
    selectedCustomer.value = res.data
  })
}

async function useSubmit (): Promise<void> {
  await ContractService.createContract({
    customerId: selectedCustomer.value!.id!,
    estateStatus: submitMode.value,
    estates: form.value.estates.map(
      (c: IEstateFormItem): IEstateItem => ({
        estateType: c.collateralType,
        detail: c.detail,
        address: c.address,
        subDistrict: c.subDistrict,
        district: c.district,
        province: c.province,
        postCode: c.postCode,
        urlGoogleMap: c?.urlGoogleMap || ''
      })
    )
  })
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  if (!selectedCustomer.value?.id) {
    toast.error('กรุณาเลือกลูกค้า')
    return
  }
  await handleLoading(useSubmit)
}


function onAddEstate (): void {
  form.value.estates.push(createEstateItem())
}

function onRemoveEstate (index: number): void {
  if (form.value.estates.length <= 1) return
  form.value.estates.splice(index, 1)
}


function onCancel (): void {
  router.push({ name: 'ContractListPage' })
}
</script>
