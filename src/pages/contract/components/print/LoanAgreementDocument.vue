<template>
  <div class="a4-preview mx-auto w-[210mm] min-h-[297mm] px-[25mm] py-[20mm] text-[12px] leading-relaxed text-black font-['Angsana_New',serif]! relative">
    <!-- Title -->
    <h1 class="text-center text-[18px] font-semibold mb-6">
      หนังสือสัญญากู้ยืมเงิน
    </h1>

    <!-- Header meta -->
    <div class="flex justify-end mb-1">
      <span>เขียนที่</span>
      <span class="inline-block border-b border-black w-60 ml-2">&nbsp;</span>
    </div>
    <div class="flex justify-end mb-6">
      <span>วันที่</span>
      <span class="border-b border-black px-2 ml-2">{{ thaiDay(doc.contractedAt) }}</span>
      <span class="ml-2">เดือน</span>
      <span class="border-b border-black px-2 ml-2">{{ thaiMonth(doc.contractedAt) }}</span>
      <span class="ml-2">พ.ศ.</span>
      <span class="border-b border-black px-2 ml-2">{{ thaiYear(doc.contractedAt) }}</span>
    </div>

    <!-- Intro paragraph -->
    <p class="text-justify mb-4 indent-3">
      สัญญากู้ยืมเงินฉบับนี้ทำขึ้นระหว่าง
      <span class="d-underline">{{ doc.branchName }}</span>
      ตั้งอยู่เลขที่
      <span class="inline-block border-b border-black w-15">&nbsp;</span>
      ถนน
      <span class="inline-block border-b border-black w-15">&nbsp;</span>
      ตำบล
      <span class="inline-block border-b border-black w-20">&nbsp;</span>
      อำเภอ
      <span class="inline-block border-b border-black w-20">&nbsp;</span>
      จังหวัด
      <span class="inline-block border-b border-black w-20">&nbsp;</span>
      ซึ่งต่อไปในสัญญาฉบับนี้จะเรียกว่า
      <strong>"ผู้ให้กู้"</strong>
      ฝ่ายหนึ่ง กับ
    </p>

    <!-- Borrowers -->
    <div
      v-for="(item, index) in doc.borrowers"
      :key="item.id"
      class="mb-2 text-justify indent-10">
      <span>{{ index + 1 }}.</span>
      <span class="d-underline min-w-[180px]">{{ item.fullName }}</span>
      <span>อายุ</span>
      <span class="border-b border-black px-2 w-10 inline-block text-center">{{ ageYear(item.birthDate) }}</span>
      <span>ปี</span>
      <span>อยู่บ้านเลขที่</span>
      <span class="d-underline min-w-[80px]">{{ item.mainAddress?.address || '' }}</span>
      <span>หมู่</span>
      <span class="d-underline min-w-[30px]">{{ item.mainAddress?.villageNo || '-' }}</span>
      <br>
      <span class="ml-6">ตำบล</span>
      <span class="border-b border-black px-2 min-w-[80px] inline-block">{{ item.mainAddress?.subDistrict || '' }}</span>
      <span class="ml-2">อำเภอ</span>
      <span class="border-b border-black px-2 min-w-[80px] inline-block">{{ item.mainAddress?.district || '' }}</span>
      <span class="ml-2">จังหวัด</span>
      <span class="border-b border-black px-2 min-w-[80px] inline-block">{{ item.mainAddress?.province || '' }}</span>
      <br>
      <span class="ml-6">บัตรประชาชนเลขที่</span>
      <span class="d-underline min-w-[160px]">{{ citizenId(item.idCard) }}</span>
    </div>

    <p class="text-justify mb-4 indent-3">
      ซึ่งต่อไปในสัญญานี้จะเรียกว่า
      <strong>"ผู้กู้"</strong>
      อีกฝ่ายหนึ่ง ทั้งสองฝ่ายตกลงกันทำสัญญากู้ยืมเงินฉบับนี้มีข้อความดังนี้
    </p>

    <!-- ข้อ 1 -->
    <p class="mb-3 text-justify indent-10">
      <strong>ข้อ 1.</strong>
      ผู้กู้ยืมเงินจากผู้ให้กู้ไปจำนวน
      <span class="border-b border-black px-2">{{ formatter.numberFormatNoDecimal(doc.loanAmount) }}</span>
      บาท (
      <span class="border-b border-black px-2">{{ formatter.numberToThaiText(doc.loanAmount) }}</span>
      )
      <br>
      โดยผู้กู้ได้รับเงินไปครบตามจำนวนดังกล่าวแล้วตั้งแต่วันที่ทำสัญญากู้ยืมเงินฉบับนี้
    </p>

    <!-- ข้อ 2 -->
    <p class="d-topic">
      <strong>ข้อ 2.</strong>
      ผู้กู้ได้นำหลักทรัพย์คือ
      <template v-if="assets.length">
        <template
          v-for="(asset, index) in assets"
          :key="asset.id ?? index">
          <span class="border-black border-b">{{ formatAssetDetail(asset) }}</span>
          <br v-if="index < assets.length - 1">
        </template>
      </template>
      <template v-else>
        <span class="inline-block align-bottom border-b border-black w-64">&nbsp;</span>
      </template>
    </p>

    <!-- ข้อ 3 -->
    <p class="d-topic">
      <strong>ข้อ 3.</strong>
      ผู้กู้ตกลงว่าจะนำเงินที่กู้ไปจำนวนดังกล่าว นำมาชำระคืนให้กับผู้ให้กู้ให้เสร็จสิ้น<br>
      ภายใน
      <template v-if="doc.finalInstallmentDate">
        วันที่ <span class="border-b border-black px-2 min-w-[40px] inline-block text-center">{{ thaiDay(doc.finalInstallmentDate) }}</span>
        เดือน <span class="border-b border-black px-2 min-w-[60px] inline-block">{{ thaiMonth(doc.finalInstallmentDate) }}</span> พ.ศ.
        <span class="border-b border-black px-2 min-w-[50px] inline-block text-center">{{ thaiYear(doc.finalInstallmentDate) }}</span>
      </template>
      <template v-else>
        วันที่ <span class="inline-block border-b border-black w-20">&nbsp;</span>
        เดือน <span class="inline-block border-b border-black w-20">&nbsp;</span> พ.ศ.
        <span class="inline-block border-b border-black w-20">&nbsp;</span>
      </template>
    </p>

    <!-- ข้อ 4 -->
    <p class="d-topic">
      <strong>ข้อ 4.</strong>
      ผู้กู้ตกลงยินยอมให้คิดดอกเบี้ยในอัตราร้อยละ
      <span class="border-b border-black px-2 min-w-[30px] inline-block text-center">{{ doc.annualInterestRate }}</span>
      ต่อปี โดยผู้กู้จะนำเงินดอกเบี้ยมาชำระให้แก่ผู้ให้กู้ไปรายเดือน โดยเริ่มชำระเงินมาภายใน
      <template v-if="doc.firstInstallmentDate">
        วันที่ <span class="border-b border-black px-2 min-w-[40px] inline-block text-center">{{ thaiDay(doc.firstInstallmentDate) }}</span>
        เดือน <span class="border-b border-black px-2 min-w-[60px] inline-block">{{ thaiMonth(doc.firstInstallmentDate) }}</span>
        พ.ศ. <span class="border-b border-black px-2 min-w-[50px] inline-block text-center">{{ thaiYear(doc.firstInstallmentDate) }}</span><br>
        และงวดต่อๆ ไปภายในวันที่ <span class="border-b border-black px-2 min-w-[40px] inline-block text-center">{{ thaiDay(doc.firstInstallmentDate) }}</span> ของเดือนถัดไป
      </template>
      <template v-else>
        วันที่ <span class="inline-block border-b border-black w-20">&nbsp;</span>
        เดือน <span class="inline-block border-b border-black w-20">&nbsp;</span> พ.ศ.
        <span class="inline-block border-b border-black w-20">&nbsp;</span><br>
        และงวดต่อๆ ไปภายในวันที่ <span class="inline-block border-b border-black w-20">&nbsp;</span> ของเดือนถัดไป
      </template>
      จนกว่าผู้กู้จะนำเงินต้นมาชำระให้แก่ผู้ให้กู้ครบถ้วน
    </p>

    <!-- ข้อ 5 -->
    <p class="d-topic">
      <strong>ข้อ 5.</strong>
      ผู้กู้ตกลงว่าหากผู้กู้ผิดสัญญาข้อใดข้อหนึ่งในสัญญาฉบับนี้ ยินยอมให้ผู้ให้กู้เรียกเงินคืนในทันที เรียกดอกเบี้ยผิดนัดชำระตามที่เห็นสมควร
      รวมถึงคิดค่าทนายเพิ่มด้วย
    </p>

    <!-- ข้อ 6 + signatures -->
    <div :class="{ 'break-before-page': doc.borrowers.length > 1 }">
      <p class="d-topic mb-8!">
        <strong>ข้อ 6.</strong>
        ค่าฤชาธรรมเนียม ค่าทนายและค่าเสียหายต่างๆ ซึ่งผู้ให้กู้ต้องเสียไปในการทวงถาม ฟ้องร้องผู้กู้นั้น
        ผู้กู้ยินยอมใช้ให้แก่ผู้ให้กู้ตามที่เห็นสมควรทุกประการ
      </p>
      <p class="d-topic mb-10!">
        เพื่อเป็นหลักฐานสัญญาทั้งสองฝ่ายได้อ่านข้อความของสัญญาโดยตลอดแล้วตรงตามความประสงค์ของสัญญา
        ทั้งสองฝ่ายจึงได้ลงลายมือไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      <LoanAgreementSignatures
        :borrower-count="doc.borrowers.length"
        :borrowers="doc.borrowers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { formatAssetDetail } from './utils/formatAssetDetail'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import LoanAgreementSignatures from './LoanAgreementSignatures.vue'

export interface ILoanAgreementBorrower {
  id: number
  fullName: string
  idCard?: string
  birthDate?: string
  mainAddress?: IAddressRequest
}

export interface ILoanAgreementDocument {
  branchName: string
  contractedAt: string
  loanAmount: number
  annualInterestRate: number
  borrowers: ILoanAgreementBorrower[]
  assets: IPreAssetList[]
  firstInstallmentDate?: string
  finalInstallmentDate?: string
}

interface IProps {
  doc: ILoanAgreementDocument
}

const props = defineProps<IProps>()

const dayjs = useDayjs()

const assets = computed((): IPreAssetList[] => {
  return props.doc?.assets || []
})

function thaiDay (dateStr: string): string {
  return dayjs(dateStr).format('D')
}

function thaiMonth (dateStr: string): string {
  return dayjs(dateStr).format('MMMM')
}

function thaiYear (dateStr: string): string {
  return dayjs(dateStr).format('BBBB')
}

function ageYear (birthDate?: string): string {
  if (!birthDate) return '-'
  return `${dayjs().diff(dayjs(birthDate), 'year')}`
}

function citizenId (id?: string): string {
  return formatter.thaiCitizenId(id || '')
}
</script>

<style>
.d-underline {
	display: inline-block;
	vertical-align: bottom;
	border-bottom: 1px solid black;
	min-width: 100px;
}
.d-topic {
	margin-bottom: 0.75rem;
	text-align: justify;
	text-indent: 2.5rem;
}

/* A4 preview outline - only visible on screen */
@media screen {
  .a4-preview {
    outline: 1px dashed #d1d5db;
    outline-offset: 4px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    background: white;
  }
}

/* Print styles */
@media print {
  .a4-preview {
    outline: none;
    box-shadow: none;
  }
}
</style>
