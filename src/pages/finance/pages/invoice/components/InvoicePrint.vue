<template>
  <div class="print-page invoice-a4 max-w-[900px] mx-auto bg-white p-8 text-[10px]">
    <!-- HEADER -->
    <div class="flex justify-between items-start mb-6">
      <div class="flex gap-4">
        <img
          class="w-24"
          src="/assets/images/logo-no-color.png"
          width="58px">
        <div>
          <div> บริษัท มิตรแท้อีสาน จำกัด (สำนักงานใหญ่) </div>
          <div>133/3 ถนนประชาสโมสร ตำบลในเมือง อำเภอเมืองขอนแก่น จ.ขอนแก่น</div>
          <div>เลขผู้เสียภาษี : 0405546000780</div>
        </div>
      </div>
    </div> <!-- CUSTOMER BOX -->
    <div class="relative border-[2px] border-zinc-700 rounded-2xl rounded-tr-none">
      <!-- INVOICE TITLE -->
      <div
        class="absolute right-[-3px] -top-[92px] bg-gradient-to-r from-zinc-800 to-zinc-700 text-white px-12 py-6 rounded-t-2xl text-center w-[215px] flex flex-col gap-3">
        <div class="text-base leading-none">
          Invoice
        </div>
        <div class="text-xs opacity-90">
          ใบแจ้งหนี้
        </div>
      </div>
      <div class="grid grid-cols-3 text-[10px]">
        <!-- LEFT -->
        <div class="p-6 col-span-2 space-y-2 border-r-2 border-zinc-700">
          <div class="grid grid-cols-2">
            <div>
              <div> ชื่อลูกค้า </div>
              <div class="text-gray-500">
                Customer Name
              </div>
            </div>
            <div>: {{ formatter.fullName(form.contract?.customer) }}</div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div> เลขประจำตัวประชาชน </div>
              <div class="text-gray-500">
                ID Number
              </div>
            </div>
            <div>: {{ form.contract?.customer?.idCard }}</div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div> ที่อยู่ </div>
              <div class="text-gray-500">
                Address
              </div>
            </div>
            <div>
              : {{ formatter.fullAddress({
                address: form?.contract?.customer.mainAddress?.address, district:
                  form?.contract?.customer.mainAddress?.district, postCode:
                  form?.contract?.customer.mainAddress?.postCode, province:
                  form?.contract?.customer.mainAddress?.province, subDistrict:
                  form?.contract?.customer.mainAddress?.subDistrict }) || '-' }}
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div> เลขอ้างอิงสัญญา </div>
              <div class="text-gray-500">
                Contract reference No.
              </div>
            </div>
            <div>: {{ form.contract?.idNo }}</div>
          </div>
        </div> <!-- RIGHT -->
        <div class="p-6 space-y-2">
          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                เลขที่ใบแจ้งหนี้
              </div>
              <div class="text-gray-500">
                Invoice No.
              </div>
            </div>
            <div>: {{ form.idNo }}</div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                วันที่ออกเอกสาร
              </div>
              <div class="text-gray-500">
                Date of payment
              </div>
            </div>
            <div>: {{ dayjs.formatDate(form.createdAt || '') }}</div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                สาขา
              </div>
              <div class="text-gray-500">
                Branch
              </div>
            </div>
            <div>: {{ installmentForm?.contract?.branch?.name }}</div>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                วันครบกำหนดชำระ
              </div>
              <div class="text-gray-500">
                Due Date
              </div>
            </div>
            <div>: {{ dayjs.formatDate(installmentForm.contractInstallment.dueDate || '') }}</div>
          </div>
        </div>
      </div>
    </div> <!-- TABLE -->
    <div class="border-2 border-zinc-700 rounded-xl mt-4">
      <table class="w-full">
        <thead class="bg-zinc-700 text-white">
          <tr>
            <th class="p-3 text-left w-16">
              ลำดับ
            </th>
            <th class="p-3 text-left">
              รายละเอียด
            </th>
            <th class="p-3 text-center w-24">
              จำนวน
            </th>
            <th class="p-3 text-right w-32">
              ราคา
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in installmentItems"
            :key="index"
            class="border-t">
            <td class="p-3">
              {{ indexChunk * 5 + Number(index) + 1 }}
            </td>
            <td class="p-3">
              {{ item.name }}
            </td>
            <td class="p-3 text-center">
              {{ formatter.numberFormat(item.qty) }}
            </td>
            <td class="p-3 text-right">
              {{ formatter.numberFormat(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div> <!-- TOTAL -->
    <div class="grid grid-cols-2 gap-4 mt-6">
      <!-- TEXT TOTAL -->
      <div class="bg-zinc-200 text-center py-4 flex justify-center text-base items-center rounded">
        ({{
          formatter.numberToThaiText(totalPrice) }})
      </div> <!-- PRICE -->
      <div class="bg-zinc-200 py-4 px-6 rounded flex justify-between items-center">
        <div class="text-gray-600">
          รวมทั้งสิ้น <div> Amount </div>
        </div>
        <div class="text-base font-semibold">
          {{ formatter.numberFormat2Decimal(totalPrice) }}
        </div>
      </div>
    </div> <!-- NOTE -->
    <div class="grid grid-cols-12 gap-x-2 font-bold leading-relaxed mt-4">
      <div class="col-span-1">
        หมายเหตุ
      </div>
      <div class="col-span-11">
        : กรณีชำระเงินเกินกำหนดที่ระบุไว้ในใบแจ้งหนี้ ผู้กู้จะถูกคิดปรับล่าช้าในอัตราวันละ 200
        บาท โดยเริ่มคำนวณตั้งแต่วันถัดจากวันครบกำหนดชำระเป็นต้นไป จนกว่าจะชำระยอดหนี้ในงวดนั้นเสร็จสิ้น
      </div>
    </div> <!-- PAYMENT -->
    <div class="mt-4 border-y py-6 font-bold">
      <div class="mb-3">
        ช่องทางการชำระเงิน
      </div>
      <div class="mb-4">
        1. ชำระได้ที่ มิตรแท้สยาม ทุกสาขา
      </div>
      <div class="mb-4">
        2. ชำระผ่าน QR Code PromptPay ได้ที่ LINE OA @MittaeSiam
      </div> <img
        class="w-[133px] border"
        src="/images/line-add.png">
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IInvoiceDetail, IInvoiceDetailItems, IInvoiceInstallment } from '@/models/response/invoice/InvoiceRes.model'

interface IProps {
  form: IInvoiceDetail
  installmentForm: IInvoiceInstallment
  installmentItems?: IInvoiceDetailItems[]
  indexChunk: number
}
const props = defineProps<IProps>()

const dayjs = useDayjs()

const totalPrice = computed((): number =>
  props.installmentForm.items.reduce((sum: number, item: IInvoiceDetailItems): number => sum + Number(item.amount), 0))

</script>
<style scoped>
  .invoice-a4 {
    width: 210mm;
    min-width: 210mm;
  }

  @media print {
    body * {
      visibility: hidden;
    }
    .print-page,
    .print-page * {
      visibility: visible;
    }
    .print-page {
      break-after: page;
      page-break-after: always;
      display: block;
    }

    .print-page:last-child {
      break-after: auto;
      page-break-after: auto;
    }

    .print-page:last-child .invoice-a4 {
      page-break-after: auto;
    }

    .invoice-a4 {
      width: 210mm;
      min-height: 297mm;
      /* height: 297mm; */
      margin: 0 auto;
      page-break-after: always;
    }

    .no-print,
    .no-print * {
      display: none !important;
    }

    @page {
      size: A4;
      margin: 0;
    }
  }
</style>
