<template>
  <div class="print-a4 max-w-225 mx-auto bg-white! text-[10px]">
    <div
      v-for="(_, pageIndex) in pageCount"
      :key="`page-${pageIndex}`"
      class="print-page">
      <!-- HEADER -->
      <div class="flex justify-between items-start px-8 pt-8 mb-2">
        <div class="flex gap-4">
          <img
            class="w-16"
            src="/assets/images/logo-no-color.png"
            width="40px">
          <div>
            <div class="font-bold text-sm">
              บริษัท มิตรแท้อีสาน จำกัด ({{ authStore.branch?.name ?? `สำนักงานใหญ่` }})
            </div>
            <div>133/3 ถนนประชาสโมสร ตำบลในเมือง อำเภอเมืองขอนแก่น จ.ขอนแก่น</div>
            <div>เลขผู้เสียภาษี : 0405546000780</div>
          </div>
        </div>
        <div class="text-right text-[9px] text-zinc-500">
          <div>หน้า {{ pageIndex + 1 }} / {{ pageCount }}</div>
          <slot name="header-right" />
        </div>
      </div>

      <!-- TITLE -->
      <div class="text-center mb-3">
        <div class="text-base font-bold">
          {{ title }}
        </div>
      </div>

      <!-- CONTENT -->
      <div class="px-8">
        <slot
          :page="pageIndex"
          :page-count="pageCount" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/Auth'

interface IProps {
  title: string
  pageCount: number
}

defineProps<IProps>()

const authStore = useAuthStore()

</script>

<style scoped>
.print-a4 {
  width: 210mm !important;
  min-width: 210mm !important;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.print-page {
  position: relative;
  min-height: 297mm;
  page-break-after: always;
  page-break-inside: avoid;
}

.print-page:last-child {
  page-break-after: auto;
}

@media print {
  html,
  body {
    background-color: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden;
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

  .print-a4 {
    min-width: unset !important;
    width: 100% !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .print-page {
    min-height: unset !important;
    height: auto !important;
    padding: 0 !important;
    page-break-after: always;
    page-break-inside: avoid;
  }

  .print-page:last-child {
    page-break-after: auto;
  }

  .no-print,
  .no-print * {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  table {
    width: 100%;
    page-break-inside: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
