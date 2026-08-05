<template>
  <!-- Multi-borrower layout -->
  <div
    v-if="borrowerCount > 1"
    class="space-y-6">
    <div class="grid grid-cols-2 gap-8">
      <div
        v-for="item in borrowers"
        :key="item.id"
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

  <!-- Single-borrower layout -->
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
</template>

<script setup lang="ts">
import type { ILoanAgreementBorrower } from './LoanAgreementDocument.vue'

interface IProps {
  borrowers: ILoanAgreementBorrower[]
  borrowerCount: number
}

defineProps<IProps>()
</script>
