<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :initial-values="formData"
    :resolver="resolver"
    class="grid grid-cols-1 md:grid-cols-2 gap-5"
    @submit="onFormSubmit($event)">
    <BaseContainer>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold after:content-['*'] after:text-red-500 after:ml-0.5">ลูกค้า</span>
          <div
            v-if="props.primaryCustomerName"
            class="flex items-center gap-2 h-9 px-3 border border-surface-300 rounded-sm bg-surface-50">
            <Icon
              class="size-4 text-surface-400 shrink-0"
              icon="solar:user-bold" />
            <span class="flex-1 text-sm truncate">{{ props.primaryCustomerName }}</span>
          </div>
          <div
            v-for="(customer, index) in localCustomers"
            :key="index"
            class="flex items-center gap-2">
            <div class="flex-1">
              <CustomerSelection
                :model-value="customer.id"
                @update:model-value="updateCustomer(index, $event)" />
            </div>
            <button
              class="shrink-0 size-8 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
              type="button"
              text
              @click="removeCustomer(index)">
              <Icon
                class="size-5"
                icon="mdi:delete-outline" />
            </button>
          </div>

          <Button
            class="flex items-center justify-start gap-1.5 text-primary text-sm font-medium hover:opacity-80 transition-opacity"
            type="button"
            text
            @click="addCustomer()">
            <Icon
              class="size-4"
              icon="mdi:plus" />
            เพิ่มลูกค้าในสัญญา
          </Button>
        </div>

        <Divider />

        <!-- Guarantors section -->
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold">ผู้ค้าประกัน</span>

          <div
            v-for="(guarantor, index) in localGuarantors"
            :key="index"
            class="flex items-center gap-2">
            <div class="flex-1">
              <CustomerSelection
                :model-value="guarantor.id"
                @update:model-value="updateGuarantor(index, $event)" />
            </div>
            <button
              class="shrink-0 size-8 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
              type="button"
              @click="removeGuarantor(index)">
              <Icon
                class="size-5"
                icon="mdi:delete-outline" />
            </button>
          </div>

          <Button
            class="flex items-center justify-start gap-1.5 text-primary text-sm font-medium hover:opacity-80 transition-opacity"
            type="button"
            text
            @click="addGuarantor()">
            <Icon
              class="size-4"
              icon="mdi:plus" />
            เพิ่มผู้ค้าประกันในสัญญา
          </Button>
        </div>
      </div>
    </BaseContainer>

    <!-- Right: contract details -->
    <BaseContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabelField
          :form="$form"
          label="วันที่ทำสัญญา"
          name="contractDate"
          tag="div"
          required>
          <template #default="{ invalid }">
            <DatePickerInput
              v-model="localContractDate"
              :invalid="invalid"
              name="contractDate"
              @update:model-value="syncContractDate()" />
          </template>
        </LabelField>

        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="ประเภทเงินกู้"
          name="loanTypeId"
          tag="div"
          required>
          <ContractLoanTypeSelection
            v-model="formData.loanTypeId"
            :invalid="invalid"
            name="loanTypeId" />
        </LabelField>

        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="วัตถุประสงค์การกู้"
          name="loanPurposeId"
          tag="div"
          required>
          <ContractLoanPurposeSelection
            v-model="formData.loanPurposeId"
            :invalid="invalid"
            name="loanPurposeId" />
        </LabelField>

        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="รู้จักเราจากที่ไหน"
          name="customerSourceId"
          tag="div"
          required>
          <HowDidFindUsSelection
            v-model="formData.customerSourceId"
            :invalid="invalid"
            name="customerSourceId" />
        </LabelField>
      </div>
    </BaseContainer>
  </Form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import ContractLoanPurposeSelection from '@/components/selection/modules/contract-loan-purpose/ContractLoanPurposeSelection.vue'
import ContractLoanTypeSelection from '@/components/selection/modules/contract-loan-type/ContractLoanTypeSelection.vue'
import CustomerSelection from '@/components/selection/modules/customer/CustomerSelection.vue'
import HowDidFindUsSelection from '@/components/selection/modules/how-did-find-us/HowDidFindUsSelection.vue'
import { Icon } from '@iconify/vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { MortgageFormValues } from '../schema/mortgage.schema'
import { MortgageSchema, useFormInitialValues } from '../schema/mortgage.schema'

interface ISelectItem {
  id: number | null
}

interface IProps {
  primaryCustomerName?: string | null
}

interface IEmits {
  confirmed: []
}

const props = withDefaults(defineProps<IProps>(), {
  primaryCustomerName: null
})
const emit = defineEmits<IEmits>()

const model = defineModel<MortgageFormValues>({ required: true })

const { formatDateRequest } = useDayjs()

const formRef = useTemplateRef<InstanceType<typeof Form> | any>('formRef')
const resolver = zodResolver(MortgageSchema)
const formData = ref<MortgageFormValues>(useFormInitialValues())
const localContractDate = ref<Date | null>(null)
const localCustomers = ref<ISelectItem[]>([])
const localGuarantors = ref<ISelectItem[]>([])

function syncContractDate (): void {
  formData.value.contractDate = formatDateRequest(localContractDate.value ?? undefined) ?? ''
}

function updateCustomer (index: number, value: number | null | undefined): void {
  localCustomers.value[index] = { id: value ?? null }
}

function updateGuarantor (index: number, value: number | null | undefined): void {
  localGuarantors.value[index] = { id: value ?? null }
}

function addCustomer (): void {
  localCustomers.value.push({ id: null })
}

function removeCustomer (index: number): void {
  localCustomers.value.splice(index, 1)
}

function addGuarantor (): void {
  localGuarantors.value.push({ id: null })
}

function removeGuarantor (index: number): void {
  localGuarantors.value.splice(index, 1)
}

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  model.value = {
    ...(event.values as MortgageFormValues),
    customerIds: localCustomers.value
      .map((c: ISelectItem): number | null => c.id)
      .filter((id: number | null): id is number => id !== null),
    guarantorIds: localGuarantors.value
      .map((g: ISelectItem): number | null => g.id)
      .filter((id: number | null): id is number => id !== null)
  }
  emit('confirmed')
}

async function submit (): Promise<void> {
  const event = await formRef.value?.validate()
  onFormSubmit({ ...event, valid: Object.keys(event?.errors).length === 0 })
}

defineExpose({ submit })
</script>
