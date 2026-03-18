<template>
  <div class="flex flex-col gap-5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Left: form -->
      <BaseContainer class="md:col-span-2">
        <Form
          :key="formKey"
          ref="formRef"
          v-slot="$form"
          :initial-values="form"
          :resolver="resolver"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          @submit="onFormSubmit($event)">
          <LabelField
            :form="$form"
            label="จำนวนเงินที่ต้องการกู้ (บาท)"
            name="loanAmount"
            required>
            <template #default="{ invalid }">
              <InputNumber
                v-model="form.loanAmount"
                :class="invalid ? 'border-red-400!' : ''"
                :invalid="invalid"
                :max-fraction-digits="0"
                class="h-9 shadow-none!"
                fluid
                readonly
                @update:model-value="recalculate()" />
            </template>
          </LabelField>

          <LabelField
            :form="$form"
            label="จำนวนงวดของการกู้ยืม"
            name="installments"
            required>
            <template #default="{ invalid }">
              <InputNumber
                v-model="form.installmentCount"
                :class="invalid ? 'border-red-400!' : ''"
                :invalid="invalid"
                :max-fraction-digits="0"
                :min="1"
                class="h-9 shadow-none!"
                fluid
                @update:model-value="recalculate()" />
            </template>
          </LabelField>

          <LabelField
            :form="$form"
            label="ประเภทดอกเบี้ย"
            name="interestType"
            tag="div"
            required>
            <template #default="{ invalid }">
              <InterestTypeSelection
                v-model="form.interestType"
                :invalid="invalid"
                name="interestType"
                @change="recalculate()" />
            </template>
          </LabelField>
          <LabelField
            :form="$form"
            label="อัตราดอกเบี้ยเงินกู้ต่อปี (%)"
            name="annualInterestRate"
            required>
            <template #default="{ invalid }">
              <InputNumber
                v-model="form.annualInterestRate"
                :class="invalid ? 'border-red-400!' : ''"
                :invalid="invalid"
                :max-fraction-digits="2"
                :min="0"
                class="h-9 shadow-none!"
                fluid
                @update:model-value="recalculate()" />
            </template>
          </LabelField>

          <LabelField
            :form="$form"
            label="ค่าปรับกรณีล่าช้า"
            name="lateFee"
            required>
            <template #default="{ invalid }">
              <InputNumber
                v-model="form.lateFee"
                :class="invalid ? 'border-red-400!' : ''"
                :invalid="invalid"
                :max-fraction-digits="0"
                :min="0"
                class="h-9 shadow-none!"
                fluid
                readonly />
            </template>
          </LabelField>
        </Form>
      </BaseContainer>

      <!-- Right: summary cards -->
      <div class="flex flex-col gap-5">
        <BaseContainer class="flex flex-col items-center justify-center gap-1 py-6">
          <span class="text-4xl font-bold text-green-600">{{ formatter.numberFormat(Math.round(monthlyPayment)) }}</span>
          <span class="text-sm text-surface-500">ยอดชำระต่อเดือน</span>
        </BaseContainer>
        <BaseContainer class="flex flex-col items-center justify-center gap-1 py-6">
          <span class="text-4xl font-bold text-orange-500">{{ formatter.numberFormat(Math.round(totalInterest)) }}</span>
          <span class="text-sm text-surface-500">ดอกเบี้ยรวม</span>
        </BaseContainer>
      </div>
    </div>
    <InstallmentTable
      v-if="schedule?.length"
      :items="schedule" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatter } from '@/utils/Formatter'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import LabelField from '@/components/input/LabelField.vue'
import InterestTypeSelection from '@/components/selection/modules/static/interest-type/InterestTypeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import {
  computeInstallmentSchedule,
  computeMonthlyPayment,
  computeTotalInterest,
  type IInstallmentRow,
  type InstallmentFormValues,
  InstallmentSchema,
  type PreAssetMakeAContractFormValues
} from '../schema/installment.schema'
import InstallmentTable from './InstallmentTable.vue'

interface IProps {
  contract: IPreContractById
}

const props = withDefaults(defineProps<IProps>(), {})

const form = defineModel<InstallmentFormValues>({ required: true })
const resolver = zodResolver(InstallmentSchema)
const schedule = ref<IInstallmentRow[]>([])
const monthlyPayment = ref<number>(0)
const totalInterest = ref<number>(0)
const formKey = ref<number>(0)

function recalculate (): void {
  const v = form.value
  if (!v.loanAmount || !v.installmentCount || v.installmentCount <= 0) {
    schedule.value = []
    monthlyPayment.value = 0
    totalInterest.value = 0
    return
  }
  monthlyPayment.value = computeMonthlyPayment(v)
  totalInterest.value = computeTotalInterest(v)
  schedule.value = computeInstallmentSchedule(v)
}

function useInit (): void {
  form.value = {
    preAssets: props.contract.preAssets.map((e: IPreAssetList): PreAssetMakeAContractFormValues => ({
      id: e.id,
      files: e?.files,
      locationId: null
    })),
    loanAmount: props.contract.loanAmount,
    installmentCount: props.contract.installmentCount,
    interestType: props.contract.interestType,
    annualInterestRate: props.contract.annualInterestRate,
    lateFee: props.contract.lateFee
  }
}

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  form.value = event.values as InstallmentFormValues
  recalculate()
}

watch((): IPreContractById => props.contract, (): void => {
  useInit()
}, { immediate: true })
</script>
