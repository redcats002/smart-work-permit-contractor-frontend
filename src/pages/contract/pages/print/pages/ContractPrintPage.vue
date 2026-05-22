<template>
  <A4Paper>
    <div class="min-h-screen bg-white">
      <div
        v-if="contract"
        class="mx-auto w-[210mm] px-[25mm] py-[20mm] text-[14px] leading-relaxed text-black font-['Angsana_New',serif]!">
        <!-- Title -->
        <h1 class="text-center text-[18px] font-bold mb-6">
          หนังสือสัญญากู้ยืมเงิน
        </h1>

        <!-- Header meta -->
        <div class="text-center mb-1">
          เขียนที่
          <span class="inline-block border-b border-black w-80">&nbsp;</span>
        </div>
        <div class="text-center mb-6">
          วันที่ {{ thaiDay(contract.contractedAt) }} เดือน {{ thaiMonth(contract.contractedAt) }} พ.ศ. {{ thaiYear(contract.contractedAt) }}
        </div>

        <!-- Intro paragraph -->
        <p class="text-justify mb-4 indent-8">
          สัญญากู้ยืมเงินฉบับนี้ทำขึ้นระหว่าง
          <strong>{{ branch.name }}</strong>
          ตั้งอยู่เลขที่
          <span class="inline-block border-b border-black w-52">&nbsp;</span>
          ตำบล
          <span class="inline-block border-b border-black w-24">&nbsp;</span>
          อำเภอ
          <span class="inline-block border-b border-black w-24">&nbsp;</span>
          จังหวัด
          <span class="inline-block border-b border-black w-24">&nbsp;</span>
          ซึ่งต่อไปในสัญญาฉบับนี้จะเรียกว่า
          <strong>"ผู้ให้กู้"</strong>
          ฝ่ายหนึ่ง กับ

          <template
            v-for="(item, index) in contract.borrowers"
            :key="item.customer.id">
            <br>
            {{ index + 1 }}. {{ fullName(item.customer) }} อายุ {{ ageYear(item.customer.birthDate) }} อยู่บ้านเลขที่
            {{ item.customer.mainAddress?.address }} ตำบล {{ item.customer.mainAddress?.subDistrict }} อำเภอ
            {{ item.customer.mainAddress?.district }} จังหวัด {{ item.customer.mainAddress?.province }} บัตรประชาชนเลขที่
            {{ citizenId(item.customer.idCard) }}
          </template>
          <br>
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า
          <strong>"ผู้กู้"</strong>
          อีกฝ่ายหนึ่ง ทั้งสองฝ่ายตกลงกันทำสัญญากู้ยืมเงินฉบับนี้มีข้อความดังนี้
        </p>

        <!-- ข้อ 1 -->
        <p class="mb-3 text-justify">
          <strong>ข้อ 1.</strong>
          ผู้กู้ยืมเงินจากผู้ให้กู้ไปจำนวน
          <strong>{{ formatter.numberFormatNoDecimal(contract.loanAmount) }}</strong>
          บาท (
          <strong>{{ formatter.numberToThaiText(contract.loanAmount) }}</strong>
          ) โดยผู้กู้ได้รับเงินไปครบตามจำนวนดังกล่าวแล้วตั้งแต่วันที่ทำสัญญากู้ยืมเงินฉบับนี้
        </p>

        <!-- ข้อ 2 -->
        <p class="mb-3 text-justify">
          <strong>ข้อ 2.</strong>
          ผู้กู้ได้นำหลักทรัพย์คือ
          <template v-if="asset && isLand(asset.type)">
            {{ asset.detail }}
            เลขที่ {{ asset.realEstateForm?.aerialPhotoMapNo || '-' }} เลขที่ดิน {{ asset.realEstateForm?.landNo || '-' }} หน้าสำรวจ
            {{ asset.realEstateForm?.surveyNo || '-' }} ตำบล {{ asset.realEstateForm?.subDistrict || '-' }} อำเภอ
            {{ asset.realEstateForm?.district || '-' }} จังหวัด {{ asset.realEstateForm?.province || '-' }}
          </template>
          <template v-else-if="asset && isVehicle(asset.type)">
            {{ asset.detail }}
            ยี่ห้อ {{ asset.vehicleForm?.brand || '-' }} รุ่น {{ asset.vehicleForm?.model || '-' }} สี
            {{ asset.vehicleForm?.color || '-' }} หมายเลขทะเบียน {{ asset.vehicleForm?.plateNo || '-' }} จังหวัด
            {{ asset.vehicleForm?.province || '-' }}
          </template>
          <template v-else>
            <span class="inline-block border-b border-black w-64">&nbsp;</span>
          </template>
        </p>

        <!-- ข้อ 3 -->
        <p class="mb-3 text-justify">
          <strong>ข้อ 3.</strong>
          ผู้กู้ตกลงว่าจะนำเงินที่กู้ไปจำนวนดังกล่าว นำมาชำระคืนให้กับผู้ให้กู้ให้เสร็จสิ้นภายใน วันที่
          {{ thaiDay(contract.finalInstallmentDate) }} เดือน {{ thaiMonth(contract.finalInstallmentDate) }} พ.ศ.
          {{ thaiYear(contract.finalInstallmentDate) }}
        </p>

        <!-- ข้อ 4 -->
        <p class="mb-3 text-justify">
          <strong>ข้อ 4.</strong>
          ผู้กู้ตกลงยินยอมให้คิดดอกเบี้ยในอัตราร้อยละ
          <strong>{{ contract.annualInterestRate }}</strong>
          ต่อปี โดยผู้กู้จะนำเงินดอกเบี้ยมาชำระให้แก่ผู้ให้กู้ไปรายเดือน โดยเริ่มชำระเงินมาภายในวันที่
          {{ thaiDay(contract.firstInstallmentDate) }} เดือน {{ thaiMonth(contract.firstInstallmentDate) }} พ.ศ.
          {{ thaiYear(contract.firstInstallmentDate) }} และงวดต่อๆ ไปภายในวันที่ {{ thaiDay(contract.firstInstallmentDate) }} ของเดือนถัดไป
          จนกว่าผู้กู้จะนำเงินต้นมาชำระให้แก่ผู้ให้กู้ครบถ้วน
        </p>

        <!-- ข้อ 5 -->
        <p class="mb-3 text-justify">
          <strong>ข้อ 5.</strong>
          ผู้กู้ตกลงว่าหากผู้กู้ผิดสัญญาข้อใดข้อหนึ่งในสัญญาฉบับนี้ ยินยอมให้ผู้ให้กู้เรียกเงินคืนในทันที เรียกดอกเบี้ยผิดนัดชำระตามที่เห็นสมควร
          รวมถึงคิดค่าทนายเพิ่มด้วย
        </p>

        <!-- ข้อ 6 + signatures (page-break-before when 2+ borrowers) -->
        <div :class="{ 'break-before-page': contract.borrowers.length > 1 }">
          <p class="mb-6 text-justify">
            <strong>ข้อ 6.</strong>
            ค่าฤชาธรรมเนียม ค่าทนายและค่าเสียหายต่างๆ ซึ่งผู้ให้กู้ต้องเสียไปในการทวงถาม ฟ้องร้องผู้กู้นั้น
            ผู้กู้ยินยอมใช้ให้แก่ผู้ให้กู้ตามที่เห็นสมควรทุกประการ
          </p>
          <p class="mb-8 text-justify indent-8">
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
                  <span class="inline-block border-b border-black w-32">&nbsp;</span>
                  ผู้กู้
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block border-b border-black w-32">&nbsp;</span>
                  )
                </div>
              </div>
            </div>
            <div class="text-center">
              <div>
                ลงชื่อ
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
                ผู้ให้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
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
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  ผู้เขียน/พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
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
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
                ผู้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
                )
              </div>
            </div>
            <div class="text-center">
              <div>
                ลงชื่อ
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
                ผู้ให้กู้
              </div>
              <div class="mt-1">
                (
                <span class="inline-block border-b border-black w-40">&nbsp;</span>
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
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  )
                </div>
              </div>
              <div class="text-center">
                <div>
                  ลงลายมือชื่อ
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
                  ผู้เขียน/พยาน
                </div>
                <div class="mt-1">
                  (
                  <span class="inline-block border-b border-black w-28">&nbsp;</span>
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
  return `${dayjs().diff(dayjs(birthDate), 'year')} ปี`
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

<style></style>
