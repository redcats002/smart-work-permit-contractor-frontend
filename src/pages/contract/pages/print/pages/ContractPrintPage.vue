<template>
  <section id="contract-print-page">
    <PageTitle class="no-print" />
    <BasePage>
      <div class="mb-4 flex justify-between no-print">
        <BackButton />
        <PrintButton @click="onPrint()" />
      </div>
      <div id="print-area">
        <A4Paper>
          <div class="bg-white">
            <LoanAgreementDocument
              v-if="doc"
              :doc="doc" />
          </div>
        </A4Paper>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { formatter } from '@/utils/Formatter'
import type { IBorrowersItems } from '@/models/response/contract/ContractRes.model'
import A4Paper from '@/components/paper/A4Paper.vue'
import type { ILoanAgreementDocument } from '@/pages/contract/components/print/LoanAgreementDocument.vue'
import LoanAgreementDocument from '@/pages/contract/components/print/LoanAgreementDocument.vue'
import { storeToRefs } from 'pinia'
import { useInitPrint } from '../composables/useInitPrint'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'

const route = useRoute()
const { branch } = storeToRefs(useAuthStore())

const contractId = computed((): number => Number((route.params.id as string) ?? ''))
const { contract, assets, fetch } = useInitPrint(contractId.value)

const doc = computed((): ILoanAgreementDocument | null => {
  if (!contract.value) return null
  return {
    branchName: branch.value.name,
    contractedAt: contract.value.contractedAt,
    loanAmount: contract.value.loanAmount,
    annualInterestRate: contract.value.annualInterestRate,
    assets: assets.value,
    firstInstallmentDate: contract.value.firstInstallmentDate,
    finalInstallmentDate: contract.value.finalInstallmentDate,
    borrowers: contract.value.borrowers.map(
      (b: IBorrowersItems): ILoanAgreementDocument['borrowers'][number] => ({
        id: b.customer?.id ? Number(b.customer?.id) : 0,
        fullName: formatter.fullName(b.customer),
        idCard: b.customer.idCard,
        birthDate: b.customer.birthDate,
        mainAddress: b.customer.mainAddress
      })
    )
  }
})

function onPrint (): void {
  window.print()
}

onMounted(async (): Promise<void> => {
  await fetch()
})
</script>

<style>
@media print {
  html,
  body {
    background-color: white !important;
  }

  body * {
    visibility: hidden;
  }

  .no-print {
    display: none !important;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: white !important;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
</style>
