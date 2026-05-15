<template>
  <div class="invoice-a4 max-w-[900px] mx-auto bg-white p-8 text-[10px]">
    <!-- HEADER -->
    <div class="flex justify-between items-start mb-6">
      <div class="flex gap-4">
        <img
          class="w-24"
          src="/assets/images/logo-no-color.png"
          width="58px">

        <div>
          <div>
            บริษัท มิตรแท้อีสาน จำกัด (สำนักงานใหญ่)
          </div>
          <div>133/3 ถนนประชาสโมสร ตำบลในเมือง อำเภอเมืองขอนแก่น จ.ขอนแก่น</div>
          <div>เลขผู้เสียภาษี : 0405546000780</div>
        </div>
      </div>
    </div>


    <!-- CUSTOMER BOX -->
    <div class="relative border-[2px] border-zinc-700 rounded-2xl rounded-tr-none">
      <!-- RECEIPT TITLE -->
      <div
        class="absolute right-[-3px] -top-[92px] bg-gradient-to-r from-zinc-800 to-zinc-700
      text-white px-12 py-6 rounded-t-2xl text-center w-[215px] flex flex-col gap-3">
        <div class="text-base leading-none">
          Receipt
        </div>
        <div class="text-xs opacity-90">
          ใบเสร็จ/ใบจัดส่งสินค้า
        </div>
      </div>


      <div class="grid grid-cols-3 text-[10px]">
        <!-- LEFT -->
        <div class="p-6 col-span-2 space-y-2 border-r-2 border-zinc-700">
          <div class="grid grid-cols-2">
            <div>
              <div>
                ชื่อลูกค้า
              </div>
              <div class="text-gray-500">
                Customer Name
              </div>
            </div>
            <div>: {{ formatter.fullName(form.customer) }}</div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <div>
                เลขประจำตัวประชาชน
              </div>
              <div class="text-gray-500">
                ID Number
              </div>
            </div>
            <div>: {{ form.customer?.idCard }}</div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <div>
                ที่อยู่
              </div>
              <div class="text-gray-500">
                Address
              </div>
            </div>
            <div>: {{ formatter.fullAddress({ address: form?.address, district: form?.district, postCode: form?.postCode, province: form?.province, subDistrict: form?.subDistrict }) || '-' }}</div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <div>
                เลขอ้างอิงสัญญา
              </div>
              <div class="text-gray-500">
                Contract reference No.
              </div>
            </div>
            <div>: {{ form.contractNo }}</div>
          </div>
        </div>


        <!-- RIGHT -->
        <div class="p-6 space-y-2">
          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                เลขที่ใบเสร็จ
              </div>
              <div class="text-gray-500">
                Receipt No.
              </div>
            </div>
            <div>: {{ form.receiptNo }}</div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                วันที่รับเงิน
              </div>
              <div class="text-gray-500">
                Date of payment
              </div>
            </div>
            <div>: {{ dayjs().format('DD/MM/BBBB') }}</div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <div class="font-medium">
                ผู้รับเงิน
              </div>
              <div class="text-gray-500">
                officer
              </div>
            </div>
            <div>: {{ formatter.fullName(form.officer) }}</div>
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
            <div>: {{ form.branch?.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="border-2 border-zinc-700 rounded-lg mt-4 h-[450px]">
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
            v-for="(item,index) in form.items"
            :key="index"
            class="border-b">
            <td class="p-3">
              {{ index+1 }}
            </td>
            <td class="p-3">
              {{ item.detail }}
            </td>
            <td class="p-3 text-center">
              {{ formatter.numberFormat(item.price) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TOTAL -->
    <div class="grid grid-cols-2 gap-4 mt-6">
      <!-- TEXT TOTAL -->
      <div class="bg-zinc-200 text-center py-4 flex justify-center text-base items-center rounded">
        (สองหมื่นสามพันห้าร้อยบาทถ้วน)
      </div>

      <!-- PRICE -->
      <div class="bg-zinc-200 py-4 px-6 rounded flex justify-between items-center">
        <div class="text-gray-600">
          รวมทั้งสิ้น
          <div>
            Amount
          </div>
        </div>

        <div class="text-base font-semibold">
          {{ formatter.numberFormat(totalPrice) }}
        </div>
      </div>
    </div>

    <!-- PAYMENT -->
    <div class="flex flex-wrap gap-4 mt-5">
      ช่องทางการชำระเงิน
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="paymentMethod"
          :value="EReceiptPaymentMethod.CASH"
          input-id="cash"
          name="cash" />
        <label for="cash">เงินสด</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="paymentMethod"
          :value="EReceiptPaymentMethod.BANK_TRANSFER"
          input-id="qr"
          name="QR" />
        <label for="qr">QR Code PromptPay</label>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 mt-6 text-sm font-medium">
      <div>
        ยอดหนี้คงเหลือ <span class="ml-2">: {{ form.outstanding ? formatter.numberFormat(form.outstanding) : '-' }}</span>
      </div>

      <div>
        เงินต้นคงเหลือ <span class="ml-2">: {{ form.principal ? formatter.numberFormat(form.principal) : '-' }}</span>
      </div>

      <div>
        ดอกเบี้ยคงเหลือ <span class="ml-2">: {{ form.interest ? formatter.numberFormat(form.interest) : '-' }}</span>
      </div>
    </div>

    <!-- SIGNATURE -->
    <div class="signature-box border-2 border-zinc-700 rounded-2xl mt-4 grid grid-cols-2 overflow-hidden">
      <!-- LEFT -->
      <div class="p-8 text-center border-r-2 border-zinc-700">
        <div class="mb-2 mt-8">
          ---------------------------------------------
        </div>
        <div>ผู้รับเงิน / Bill Receiver Signature</div>
        <div class="mt-2">
          วันที่ / Date __________________
        </div>
      </div>

      <!-- RIGHT -->
      <div class="p-8 text-center flex flex-col justify-end">
        <div class="mb-2">
          ---------------------------------------------
        </div>
        <div>ลูกค้า / Customer Signature</div>
        <div class="mt-2">
          วันที่ / Date __________________
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import { formatter } from '@/utils/Formatter'
import { EReceiptPaymentMethod, type TReceiptPaymentMethod } from '@/models/response/receipt/PaymentMethod.enum'
import type { IReceiptById, IReceiptDetailItems } from '@/models/response/receipt/ReceiptRes.model'
import { RadioButton } from 'primevue'

interface IProps {
  form: IReceiptById
}

const props = defineProps<IProps>()

const paymentMethod = ref<TReceiptPaymentMethod>(EReceiptPaymentMethod.CASH)

const totalPrice = computed((): number =>
  props.form.items ? props.form.items.reduce((sum: number, item: IReceiptDetailItems): number => sum + Number(item.price), 0) : 0)

</script>

<style scoped>
.invoice-a4 {
  width: 210mm !important;
  min-width: 210mm !important;
  min-height: 297mm !important;
}
@media print {
  body * {
    visibility: hidden;
    background-color: white !important;
  }
  .invoice-a4{
    min-width: 210mm !important;
    width: 210mm !important;
    min-height: 306mm !important;
    margin: 0;
    padding: 0;
    padding-top: 24px;
    box-shadow: none !important;
    border: none !important;
  }
  .no-print, .no-print *
  {
    display: none !important;
  }
  @page {
    size: A4;
    /* margin: 12mm; */
  }
    table{
    width:100%;
    page-break-inside: auto;
  }

  thead{
    display: table-header-group;
  }

  tfoot{
    display: table-footer-group;
  }

  tr{
    page-break-inside: avoid;
    page-break-after: auto;
  }

  tbody tr{
  height:32px;
}
}
.signature-box{
  page-break-inside: avoid;
}
</style>
