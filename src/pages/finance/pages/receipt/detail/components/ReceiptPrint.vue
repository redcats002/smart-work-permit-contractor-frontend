<template>
  <div class="invoice-a4 max-w-225 mx-auto bg-white! p-8 text-[10px]">
    <div class="p-8 text-[10px]">
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
      <div class="relative border-2 border-zinc-700 rounded-2xl rounded-tr-none">
        <!-- RECEIPT TITLE -->
        <div
          class="absolute right-[-3px] -top-[92px] bg-gradient-to-r from-zinc-800 to-zinc-700
      text-white px-12 py-6 rounded-t-2xl text-center w-53.75 flex flex-col gap-3">
          <div class="text-base leading-none">
            Receipt
          </div>
          <div class="text-xs opacity-90">
            ใบเสร็จ
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
              <div>: {{ customerAddress }}</div>
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
              <div>: {{ contractNos }}</div>
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
              <div>: {{ form.idNo }}</div>
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
              <div>: {{ dayjs.formatDate(form.paidAt) }}</div>
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
              <div>: {{ form.receivedBy?.fullName || '-' }}</div>
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
      <div class="border-2 border-zinc-700 rounded-lg mt-4 min-h-[200px]">
        <table class="w-full">
          <thead class="bg-zinc-700 text-white">
            <tr>
              <th class="p-3 text-left w-28">
                เลขที่สัญญา
              </th>
              <th class="p-3 text-center w-16">
                งวดที่
              </th>
              <th class="p-3 text-right">
                ค่าปรับ
              </th>
              <th class="p-3 text-right">
                ค่าติดตาม
              </th>
              <th class="p-3 text-right">
                ค่าทนาย
              </th>
              <th class="p-3 text-right">
                ดอกเบี้ย
              </th>
              <th class="p-3 text-right">
                เงินต้น
              </th>
              <th class="p-3 text-right w-28">
                รวม
              </th>
            </tr>
          </thead>

          <tbody>
            <template
              v-for="(contract, ci) in form.contracts"
              :key="`contract-${ci}`">
              <tr
                v-for="(item, ii) in contract.installments"
                :key="`row-${ci}-${ii}`"
                class="border-b">
                <td
                  v-if="ii === 0"
                  :rowspan="contract.installments.length"
                  class="p-3 font-bold text-[#bd0102] align-middle">
                  {{ contract.idNo }}
                </td>
                <td class="p-3 text-center">
                  {{ item.order }}
                </td>
                <td class="p-3 text-right">
                  {{ formatter.numberFormat2Decimal(item.penaltyFee) }}
                </td>
                <td class="p-3 text-right">
                  {{ formatter.numberFormat2Decimal(item.collectionFee) }}
                </td>
                <td class="p-3 text-right">
                  {{ formatter.numberFormat2Decimal(item.legalFee) }}
                </td>
                <td class="p-3 text-right">
                  {{ formatter.numberFormat2Decimal(item.interest) }}
                </td>
                <td class="p-3 text-right">
                  {{ formatter.numberFormat2Decimal(item.principal) }}
                </td>
                <td class="p-3 text-right font-semibold">
                  {{ formatter.numberFormat2Decimal(item.totalInstallment) }}
                </td>
              </tr>
            </template>
          </tbody>

          <tfoot>
            <tr class="bg-zinc-200 font-bold border-t-2 border-zinc-700">
              <td
                class="p-3"
                colspan="2">
                รวมทั้งสิ้น
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(form.summary.penaltyFee) }}
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(form.summary.collectionFee) }}
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(form.summary.legalFee) }}
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(form.summary.interest) }}
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(form.summary.principal) }}
              </td>
              <td class="p-3 text-right">
                {{ formatter.numberFormat2Decimal(totalPrice) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- TOTAL -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <!-- TEXT TOTAL -->
        <div class="bg-zinc-200 text-center py-4 flex justify-center text-base items-center rounded">
          {{ totalPriceText }}
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
            {{ formatter.numberFormat2Decimal(props.form.summary.totalAmount) }}
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
          ยอดเงินต้น <span class="ml-2">: {{ formatter.numberFormat2Decimal(form.summary.principal) }}</span>
        </div>

        <div>
          ดอกเบี้ย <span class="ml-2">: {{ formatter.numberFormat2Decimal(form.summary.interest) }}</span>
        </div>

        <div>
          ค่าปรับ <span class="ml-2">: {{ formatter.numberFormat2Decimal(form.summary.penaltyFee) }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { EReceiptPaymentMethod, type TReceiptPaymentMethod } from '@/models/response/receipt/PaymentMethod.enum'
import type { IReceiptById, IReceiptDetailContract, IReceiptDetailInstallment } from '@/models/response/receipt/ReceiptRes.model'
import { RadioButton } from 'primevue'

interface IProps {
  form: IReceiptById
}

const props = defineProps<IProps>()

const dayjs = useDayjs()
const paymentMethod = ref<TReceiptPaymentMethod>(EReceiptPaymentMethod.CASH)

watch((): TReceiptPaymentMethod | null => props.form.paymentType, (val: TReceiptPaymentMethod | null): void => {
  if (val) paymentMethod.value = val
}, { immediate: true })

const contractNos = computed((): string =>
  props.form.contracts.map((c: IReceiptDetailContract): string => c.idNo).join(', ') || '-'
)

const totalPrice = computed((): number =>
  props.form.contracts.reduce((acc: number, c: IReceiptDetailContract): number =>
    acc + c.installments.reduce((sum: number, item: IReceiptDetailInstallment): number => sum + item.totalInstallment, 0), 0)
)

const totalPriceText = computed((): string => {
  return `(${formatter.numberToThaiText(totalPrice.value)})`
})

const customerAddress = computed((): string => {
  const addr = props.form.customer?.mainAddress
  if (!addr) return '-'
  const parts = [
    addr.address,
    addr.villageNo ? `หมู่ ${addr.villageNo}` : '',
    addr.subDistrict ? `ตำบล${addr.subDistrict}` : '',
    addr.district ? `อำเภอ${addr.district}` : '',
    addr.province ? `จังหวัด${addr.province}` : '',
    addr.postCode
  ].filter(Boolean)
  return parts.length ? parts.join(' ') : '-'
})
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
    min-height: unset !important;
    height: auto !important;
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
    margin: 0;
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
