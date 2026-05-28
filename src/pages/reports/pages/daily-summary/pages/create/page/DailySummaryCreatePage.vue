<template>
  <section id="daily-summary-create-page">
    <PageTitle />
    <BackButton />
    <BaseContainer class="mt-4">
      <div class="flex flex-col gap-2">
        <div
          v-for="row in infoRows"
          :key="row.label"
          class="grid grid-cols-2 gap-2.5 text-sm">
          <span class="font-bold">{{ row.label }}</span>
          <div class="flex gap-1 items-center">
            <span>:</span>
            <span>{{ row.value }}</span>
          </div>
        </div>
      </div>
    </BaseContainer>
    <BasePage>
      <DailySummaryCreateDetailTable :items="findData?.detail || []" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <BaseContainer>
          <div class="flex flex-col gap-1.5 h-full">
            <p class="text-sm font-bold text-[#333]">
              หมายเหตุ
            </p>
            <Textarea
              v-model="reason"
              class="flex-1 w-full" />
          </div>
        </BaseContainer>
        <BaseContainer>
          <div class="flex flex-col gap-2">
            <template
              v-for="(row, i) in summaryRows"
              :key="i">
              <hr
                v-if="row.divider"
                class="border-[#BD0102]">
              <div
                v-else
                class="grid grid-cols-2 gap-2.5 text-sm">
                <span class="font-bold">{{ row.label }}</span>
                <div class="flex gap-1 items-center">
                  <span>:</span>
                  <span>{{ row.value }}</span>
                </div>
              </div>
            </template>
          </div>
        </BaseContainer>
      </div>
      <div class="flex gap-4 mt-4">
        <ConfirmButton
          label="ยืนยัน"
          @click="onConfirm()" />
        <CancelButton :to="{ name: 'DailySummaryListPage' }" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { formatter } from '@/utils/Formatter'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import CancelButton from '@/components/button/CancelButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryCreateDetailTable from '../components/DailySummaryCreateDetailTable.vue'
import useCreate from '../composables/useCreate'

interface IRow {
  label: string
  value: string
}

interface ISummaryRow {
  label?: string
  value?: string
  divider?: boolean
}

const { findData, reason, fetch, onConfirm } = useCreate()

const infoRows = computed((): IRow[] => [
  { label: 'สาขา', value: findData.value?.branchName || '-' },
  { label: 'วันที่', value: findData.value?.date ? findData.value.date : '-' },
  { label: 'โดย', value: findData.value?.createdBy || '-' }
])

const summaryRows = computed((): ISummaryRow[] => {
  const fmt = (v: number): string => formatter.numberFormatNoDecimal(v)
  const s = findData.value?.summaries
  return [
    { label: 'ยอดคงเหลือยกมา', value: fmt(s?.openBalance ?? 0) },
    { divider: true },
    { label: 'รับค่างวด', value: fmt(s?.installmentReceive ?? 0) },
    { label: 'รับค่าดำเนินการ', value: fmt(s?.continuedReceive ?? 0) },
    { label: 'รับค่าอื่นๆ', value: fmt(s?.otherReceive ?? 0) },
    { divider: true },
    { label: 'ยอดเงินกู้', value: fmt(s?.loanAmount ?? 0) },
    { divider: true },
    { label: 'ยอดรับรวม', value: fmt(s?.sumReceive ?? 0) },
    { label: 'ยอดจ่ายรวม', value: fmt(s?.sumPay ?? 0) },
    { divider: true },
    { label: 'ยอดคงเหลือยกไป', value: fmt(s?.closingBalance ?? 0) }
  ]
})

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
