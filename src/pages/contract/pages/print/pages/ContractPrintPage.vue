<template>
  <A4Paper>
    <div class="bg-white">
      <div
        v-if="contract"
        class="mx-auto w-[210mm] px-[25mm] py-[20mm] text-[14px] leading-relaxed text-black font-['Angsana_New',serif]!">
        <!-- Title -->
        <h1 class="text-center text-[18px] font-semibold mb-6">
          หนังสือสัญญากู้ยืมเงิน
        </h1>

        <!-- Header meta -->
        <div class="text-right mb-1">
          เขียนที่
          <span class="inline-block align-bottom border-b border-black w-70">&nbsp;</span>
        </div>
        <div class="text-right mb-6 mr-40">
          วันที่
          <span class="d-underline">{{ thaiDay(contract.contractedAt) }}</span>
          เดือน
          <span class="d-underline">{{ thaiMonth(contract.contractedAt) }}</span>
          พ.ศ.
          <span class="d-underline">{{ thaiYear(contract.contractedAt) }}</span>
        </div>

        <!-- Intro paragraph -->
        <p class="text-justify mb-4 indent-8">
          สัญญากู้ยืมเงินฉบับนี้ทำขึ้นระหว่าง
          <span class="d-underline">{{ branch.name }}</span>
          ตั้งอยู่เลขที่
          <span class="inline-block align-bottom border-b border-black w-20">&nbsp;</span>
          ถนน
          <span class="inline-block align-bottom border-b border-black w-15">&nbsp;</span>
          ตำบล
          <span class="inline-block align-bottom border-b border-black w-20">&nbsp;</span>
          อำเภอ
          <span class="inline-block align-bottom border-b border-black w-20">&nbsp;</span>
          จังหวัด
          <span class="inline-block align-bottom border-b border-black w-20">&nbsp;</span>
          ซึ่งต่อไปในสัญญาฉบับนี้จะเรียกว่า
          <br>
          <strong>"ผู้ให้กู้"</strong>
          ฝ่ายหนึ่ง กับ
          <template
            v-for="(item, index) in contract.borrowers"
            :key="item.customer.id">
            <span v-if="index === 0" />
            <br v-else>
            <span
              :class="{
                'ml-32': index !== 0,
              }">
              {{ index + 1 }}.
              <span class="d-underline w-50">{{ fullName(item.customer) }}</span>
              <span>
                <label>อายุ</label>
                <span class="border-b border-black px-2 w-10">{{ ageYear(item.customer.birthDate) }}</span><span>ปี</span>
              </span>
              <span>
                <label>อยู่บ้านเลขที่</label>
                <span class="d-underline w-20">{{ item.customer.mainAddress?.address }}</span>
              </span>
              <span>
                <label>หมู่</label>
                <span class="d-underline w-5">&nbsp;</span>
              </span>
              <span>
                <label>ตำบล</label>
                <span class="border-b border-black px-2">{{ item.customer.mainAddress?.subDistrict }}</span>
              </span>
              <span>
                <label>อำเภอ</label>
                <span class="border-b border-black px-2">{{ item.customer.mainAddress?.district }}</span>
              </span>
              <span>
                <label>จังหวัด</label>
                <span class="border-b border-black px-2">{{ item.customer.mainAddress?.province }}</span>
              </span>
              <span>
                <label>บัตรประชาชนเลขที่</label>
                <span class="d-underline w-auto">{{ citizenId(item.customer.idCard) }}</span>
              </span>
            </span>
          </template>
          <br>
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า
          <strong>"ผู้กู้"</strong>
          อีกฝ่ายหนึ่ง ทั้งสองฝ่ายตกลงกันทำสัญญากู้ยืมเงินฉบับนี้มีข้อความดังนี้
        </p>

        <!-- ข้อ 1 -->
        <p class="mb-3 text-justify indent-10">
          <strong>ข้อ 1.</strong>
          ผู้กู้ยืมเงินจากผู้ให้กู้ไปจำนวน
          <span class="border-b border-black px-2">{{ formatter.numberFormatNoDecimal(contract.loanAmount) }}</span>
          บาท (
          <span class="border-b border-black px-2">{{ formatter.numberToThaiText(contract.loanAmount) }}</span>
          )
          <br>
          โดยผู้กู้ได้รับเงินไปครบตามจำนวนดังกล่าวแล้วตั้งแต่วันที่ทำสัญญากู้ยืมเงินฉบับนี้
        </p>

        <!-- ข้อ 2 -->
        <p class="d-topic">
          <strong>ข้อ 2.</strong>
          ผู้กู้ได้นำหลักทรัพย์คือ
          <template v-if="asset && isLand(asset.type)">
            <span class="border-black border-b-1">
              {{ asset.detail }}
              เลขที่ {{ asset.realEstateForm?.aerialPhotoMapNo || '-' }} เลขที่ดิน {{ asset.realEstateForm?.landNo || '-' }} หน้าสำรวจ
              {{ asset.realEstateForm?.surveyNo || '-' }} ตำบล {{ asset.realEstateForm?.subDistrict || '-' }} อำเภอ
              {{ asset.realEstateForm?.district || '-' }} จังหวัด {{ asset.realEstateForm?.province || '-' }}
            </span>
          </template>
          <template v-else-if="asset && isVehicle(asset.type)">
            {{ asset.detail }}
            ยี่ห้อ {{ asset.vehicleForm?.brand || '-' }} รุ่น {{ asset.vehicleForm?.model || '-' }} สี
            {{ asset.vehicleForm?.color || '-' }} หมายเลขทะเบียน {{ asset.vehicleForm?.plateNo || '-' }} จังหวัด
            {{ asset.vehicleForm?.province || '-' }}
          </template>
          <template v-else>
            <span class="inline-block align-bottom border-b border-black w-64">&nbsp;</span>
          </template>
        </p>

        <!-- ข้อ 3 -->
        <p class="d-topic">
          <strong>ข้อ 3.</strong>
          ผู้กู้ตกลงว่าจะนำเงินที่กู้ไปจำนวนดังกล่าว นำมาชำระคืนให้กับผู้ให้กู้ให้เสร็จสิ้นภายใน<br>
          วันที่ <span class="border-b border-black px-2">{{ thaiDay(contract.finalInstallmentDate) }}</span>
          เดือน <span class="border-b border-black px-2">{{ thaiMonth(contract.finalInstallmentDate) }}</span> พ.ศ.
          <span class="border-b border-black px-2">{{ thaiYear(contract.finalInstallmentDate) }}</span>
        </p>

        <!-- ข้อ 4 -->
        <p class="d-topic">
          <strong>ข้อ 4.</strong>
          ผู้กู้ตกลงยินยอมให้คิดดอกเบี้ยในอัตราร้อยละ
          <span class="border-b border-black px-2">{{ contract.annualInterestRate }}</span>
          ต่อปี โดยผู้กู้จะนำเงินดอกเบี้ยมาชำระให้แก่ผู้ให้กู้ไปรายเดือน โดยเริ่มชำระเงินมาภายในวันที่
          {{ thaiDay(contract.firstInstallmentDate) }} เดือน {{ thaiMonth(contract.firstInstallmentDate) }} พ.ศ.
          {{ thaiYear(contract.firstInstallmentDate) }}<br> และงวดต่อๆ ไปภายในวันที่ {{ thaiDay(contract.firstInstallmentDate) }} ของเดือนถัดไป
          จนกว่าผู้กู้จะนำเงินต้นมาชำระให้แก่ผู้ให้กู้ครบถ้วน
        </p>

        <!-- ข้อ 5 -->
        <p class="d-topic">
          <strong>ข้อ 5.</strong>
          ผู้กู้ตกลงว่าหากผู้กู้ผิดสัญญาข้อใดข้อหนึ่งในสัญญาฉบับนี้ ยินยอมให้ผู้ให้กู้เรียกเงินคืนในทันที เรียกดอกเบี้ยผิดนัดชำระตามที่เห็นสมควร
          รวมถึงคิดค่าทนายเพิ่มด้วย
        </p>

        <!-- ข้อ 6 + signatures (page-break-before when 2+ borrowers) -->
        <div :class="{ 'break-before-page': contract.borrowers.length > 1 }">
          <p class="d-topic mb-8!">
            <strong>ข้อ 6.</strong>
            ค่าฤชาธรรมเนียม ค่าทนายและค่าเสียหายต่างๆ ซึ่งผู้ให้กู้ต้องเสียไปในการทวงถาม ฟ้องร้องผู้กู้นั้น
            ผู้กู้ยินยอมใช้ให้แก่ผู้ให้กู้ตามที่เห็นสมควรทุกประการ
          </p>
          <p class="d-topic mb-10!">
            เพื่อเป็นหลักฐานสัญญาทั้งสองฝ่ายได้อ่านข้อความของสัญญาโดยตลอดแล้วตรงตามความประสงค์ของสัญญา
            ทั้งสองฝ่ายจึงได้ลงลายมือไว้เป็นสำคัญต่อหน้าพยาน
          </p>

          <!-- Signatures: multi-borrower layout -->
          <div
            v-if="contract.borrowers.length > 1"
            class="space-y-6">
            <div class="grid grid-cols-2 gap-8">
              <div
                v-for="item in contract.borrowers"
                :key="item.customer.id"
                class="text-center">
                <div>
                  ลงชื่อ
                  <span class="inline-block align-bottom border-b border-black w-32">&nbsp;</span>
                  ผู้กู้
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block align-bottom border-b border-black w-32">&nbsp;</span>
                  )
                </div>
              </div>
            </div>
            <div class="text-center">
              <div>
                ลงชื่อ
                <span class="inline-block align-bottom border-b border-black w-80">&nbsp;</span>
                ผู้ให้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block align-bottom border-b border-black w-80">&nbsp;</span>
                )
              </div>
              <div class="text-[12px] mt-1">
                กรรมการผู้มีอำนาจกระทำการแทนบริษัทและประทับตราสำคัญของบริษัท
              </div>
            </div>
            <div class="grid grid-cols-2 gap-8 mt-6">
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  ผู้เขียน/พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
            </div>
          </div>

          <!-- Signatures: single-borrower layout -->
          <div
            v-else
            class="space-y-5">
            <div class="text-center">
              <div>
                ลงชื่อ
                <span class="inline-block align-bottom border-b border-black w-40">&nbsp;</span>
                ผู้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block align-bottom border-b border-black w-40">&nbsp;</span>
                )
              </div>
            </div>
            <div class="text-center">
              <div>
                ลงชื่อ
                <span class="inline-block align-bottom border-b border-black w-40">&nbsp;</span>
                ผู้ให้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block align-bottom border-b border-black w-40">&nbsp;</span>
                )
              </div>
              <div class="text-[12px] mt-1">
                กรรมการผู้มีอำนาจกระทำการแทนบริษัทและประทับตราสำคัญของบริษัท
              </div>
            </div>
            <div class="grid grid-cols-2 gap-8 mt-6">
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  ผู้เขียน/พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block align-bottom border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </A4Paper>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractCustomer } from '@/models/response/contract/ContractRes.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import A4Paper from '@/components/paper/A4Paper.vue'
import usePrint from '@/composables/usePrint'
import { storeToRefs } from 'pinia'
import { useInitPrint } from '../composables/useInitPrint'

const route = useRoute()
const dayjs = useDayjs()
const { branch } = storeToRefs(useAuthStore())
const { onPrint } = usePrint()

const contractId = computed((): number => Number((route.params.id as string) ?? ''))
const { contract, asset, fetch } = useInitPrint(contractId.value)

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

function fullName (customer: IContractCustomer): string {
  return formatter.fullName(customer)
}

function citizenId (id?: string): string {
  return formatter.thaiCitizenId(id || '')
}

function isLand (type: string): boolean {
  return isLandAsset(type)
}

function isVehicle (type: string): boolean {
  return isVehicleAsset(type)
}

onMounted(async (): Promise<void> => {
  await fetch()
  await nextTick()
  onPrint()
})
</script>

<style>
.d-underline {
	display: inline-block;
	vertical-align: bottom;
	border-bottom: 1px solid black;
	/* padding-right: 0.5rem;
	padding-left: 0.5rem; */
}
.d-topic {
	margin-bottom: 0.75rem;
	text-align: justify;
	text-indent: 2.5rem;
}
</style>
