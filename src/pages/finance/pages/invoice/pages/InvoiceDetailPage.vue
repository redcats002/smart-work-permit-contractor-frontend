<template>
  <section id="invoice-list-page">
    <PageTitle class="no-print" />
    <BasePage>
      <div class="mb-4 flex justify-between">
        <BackButton />
        <PrintButton @click="onPrint()" />
      </div>
      <div>
        <div
          class="page">
          <InvoicePrint
            :form="form"
            :index-chunk="0"
            :installment-form="installmentForm"
            :installment-items="installmentForm.items"
            class="page"
            @on-add-row="onAddRow()"
            @on-delete-row="onDeleteRow($event)" />
        </div>
      </div>
      <div
        id="print-area">
        <div
          v-for="(page,index) in paginatedInstallment"
          :key="index"
          class="page">
          <InvoicePrint
            :form="form"
            :index-chunk="index"
            :installment-form="installmentForm"
            :installment-items="page"
            class="page"
            @on-add-row="onAddRow()"
            @on-delete-row="onDeleteRow($event)" />
        </div>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { IInvoiceDetailItems } from '@/models/response/invoice/InvoiceRes.model'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InvoicePrint from '../components/InvoicePrint.vue'
import useDetail from '../composables/useDetail'

const { form, installmentForm, fetchById } = useDetail()
const chunkSize = 5
const paginatedInstallment = computed((): IInvoiceDetailItems[][] => {
  const chunks: IInvoiceDetailItems[][] = []
  for (let i = 0; i < installmentForm.value.items.length; i += chunkSize) {
    chunks.push(installmentForm.value.items.slice(i, i + chunkSize))
  }
  return chunks
})
function onAddRow (): void {
  installmentForm.value.items.push({
    name: '',
    amount: 0,
    qty: 0,
    isMain: false
  })
}

function onDeleteRow (index: number): void {
  installmentForm.value.items.splice(index, 1)
}
function onPrint (): void {
  window.print()
}
onMounted((): void => {
  fetchById()
})
</script>

<style scoped>
.page {
  page-break-after: always;
}

#print-area {
  display: none;
}

@media print {
  body * {
    visibility: hidden;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
  }

  .no-print {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 0;
  }

}
</style>
