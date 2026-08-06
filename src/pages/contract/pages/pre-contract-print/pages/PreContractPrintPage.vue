<template>
  <section id="pre-contract-print-page">
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
import A4Paper from '@/components/paper/A4Paper.vue'
import { storeToRefs } from 'pinia'
import { useInitPreContractPrint } from '../composables/useInitPreContractPrint'
import LoanAgreementDocument from '@/pages/contract/components/print/LoanAgreementDocument.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'

const route = useRoute()
const { branch } = storeToRefs(useAuthStore())

const contractId = computed((): number => Number((route.params.id as string) ?? ''))
const { doc, fetch } = useInitPreContractPrint(contractId.value, branch.value.name)

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
