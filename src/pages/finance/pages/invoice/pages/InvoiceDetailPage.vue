<template>
  <section id="invoice-list-page">
    <PageTitle class="no-print" />
    <BasePage>
      <div class="mb-4 flex justify-between">
        <BackButton />
        <PrintButton @click="onPrint()" />
      </div>
      <InvoicePrint
        id="print-area"
        :form="form"
        @on-add-row="onAddRow()"
        @on-delete-row="onDeleteRow($event)" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InvoicePrint from '../components/InvoicePrint.vue'
import useDetail from '../composables/useDetail'

const { form, fetchById } = useDetail()

function onAddRow (): void {
  form.value.items.push({
    detail: '',
    amount: 0,
    price: 0,
    new: true
  })
}

function onDeleteRow (index: number): void {
  form.value.items.splice(index, 1)
}
function onPrint (): void {
  window.print()
}
onMounted((): void => {
  fetchById()
})
</script>

<style scoped>
@media print {

  body * {
    visibility: hidden;
    background-color: white !important;
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
  }

  @page {
    size: A4;
    /* margin: 12mm; */
    background-color: white !important;
  }

}
</style>
