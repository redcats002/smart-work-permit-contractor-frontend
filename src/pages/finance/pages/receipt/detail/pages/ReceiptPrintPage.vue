<template>
  <section id="receipt-print-page">
    <PageTitle class="no-print" />
    <BasePage>
      <div class="mb-4 flex justify-between no-print">
        <BackButton />
        <PrintButton @click="onPrint()" />
      </div>
      <ReceiptPrint
        id="print-area"
        :form="form" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ReceiptPrint from '../components/ReceiptPrint.vue'
import useDetail from '../composables/useDetail'

const { form, fetchById } = useDetail()

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
    background-color: white !important;
  }

}
</style>
