<template>
  <section id="close-account-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>

    <BasePage>
      <CustomerInfoCard />
    </BasePage>

    <BasePage>
      <InstallmentTable />
    </BasePage>

    <BasePage>
      <AdditionalExpensesTable
        :rows="additionalExpenses"
        @add="openModalAdd()"
        @remove="onRemoveExpense($event)" />
    </BasePage>

    <BasePage>
      <PaymentSummary
        :other-expenses="otherExpenses" />
    </BasePage>

    <BasePage>
      <div class="bg-[#ffd1d1] rounded-lg p-4 w-full flex justify-center">
        <span class="text-base text-[#bd0102]">ยอดชำระรวม 83,000 บาท</span>
      </div>
    </BasePage>

    <BasePage>
      <PaymentMethodSelector v-model="paymentMethod" />
    </BasePage>

    <SaveExpenseModal
      v-model="showExpenseModal"
      @submit="onExpenseSubmit($event)" />

    <BasePage>
      <div class="flex gap-4 items-center flex-wrap">
        <button
          class="bg-[#bd0102] hover:bg-[#a00001] h-10 px-6 rounded text-white text-base cursor-pointer"
          type="button"
          @click="onSubmit()">
          ถัดไป
        </button>
        <button
          class="bg-white border border-[#bd0102] hover:bg-[#fff5f5] h-10 px-6 rounded text-[#bd0102] text-base cursor-pointer"
          type="button"
          @click="onCancel()">
          ยกเลิก
        </button>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import type { IAdditionalExpenseRow } from '../components/AdditionalExpensesTable.vue'
import AdditionalExpensesTable from '../components/AdditionalExpensesTable.vue'
import CustomerInfoCard from '../components/CustomerInfoCard.vue'
import InstallmentTable from '../components/InstallmentTable.vue'
import PaymentMethodSelector, { type TPaymentMethod } from '../components/PaymentMethodSelector.vue'
import PaymentSummary from '../components/PaymentSummary.vue'
import SaveExpenseModal from '../components/SaveExpenseModal.vue'

const router = useRouter()
const paymentMethod = ref<TPaymentMethod>('cash')
const showExpenseModal = ref<boolean>(false)
const additionalExpenses = ref<IAdditionalExpenseRow[]>([])

const otherExpenses = computed((): number => additionalExpenses.value.reduce((total: number, expense: IAdditionalExpenseRow): number =>
  total + expense.amount, 0))

function onRemoveExpense (index: number): void {
  additionalExpenses.value.splice(index, 1)
}

function onExpenseSubmit (data: { note: string, amount: number }): void {
  additionalExpenses.value.push({
    label: data.note,
    amount: data.amount
  })
}

function openModalAdd (): void {
  showExpenseModal.value = true
}

function onSubmit (): void {
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ReceiptListPage' })
}

function onCancel (): void {
  router.push({ name: 'ReceiptListPage' })
}
</script>
