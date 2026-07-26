<template>
  <section id="daily-summary-detail-page">
    <PageTitle />
    <BackButton />
    <div class="flex justify-end">
      <PrintButton
        icon="material-symbols:print-outline-rounded"
        label="พิมพ์"
        @click="onPrint()" />
    </div>
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
      <DailySummaryDetailItemTable :items="itemData?.items || []" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <BaseContainer>
          <div class="flex flex-col gap-1.5">
            <p class="text-sm font-bold text-[#333]">
              หมายเหตุ
            </p>
            <div class="flex gap-1 text-sm">
              <span>:</span>
              <span class="whitespace-pre-line">{{ itemData?.reason || '-' }}</span>
            </div>
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
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatter } from '@/utils/Formatter'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BackButton from '@/components/button/BackButton.vue'
import PrintButton from '@/components/button/PrintButton.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DailySummaryDetailItemTable from '../components/DailySummaryDetailItemTable.vue'
import useList from '../composables/useList'

interface IRow {
  label: string
  value: string
}

interface ISummaryRow {
  label?: string
  value?: string
  divider?: boolean
}

const route = useRoute()
const router = useRouter()

const { itemData, fetch } = useList()

const infoRows = computed((): IRow[] => [
  { label: 'สาขา', value: itemData.value?.branchName || '-' },
  { label: 'เลขที่เอกสาร', value: itemData.value?.idNo || '-' },
  { label: 'วันที่', value: itemData.value?.date ? itemData.value.date : '-' },
  { label: 'โดย', value: itemData.value?.createdBy || '-' }
])

const summaryRows = computed((): ISummaryRow[] => {
  const fmt = (v: number): string => formatter.numberFormatNoDecimal(v)
  const d = itemData.value
  return [
    { label: 'ยอดคงเหลือยกมา', value: fmt(d?.openBalance ?? 0) },
    { divider: true },
    { label: 'รับค่างวด', value: fmt(d?.installmentReceive ?? 0) },
    { label: 'รับค่าดำเนินการ', value: fmt(d?.continuedReceive ?? 0) },
    { label: 'รับค่าอื่นๆ', value: fmt(d?.otherReceive ?? 0) },
    { divider: true },
    { label: 'ยอดเงินกู้', value: fmt(d?.loanAmount ?? 0) },
    { divider: true },
    { label: 'ยอดรับรวม', value: fmt(d?.sumReceive ?? 0) },
    { label: 'ยอดจ่ายรวม', value: fmt(d?.sumPay ?? 0) },
    { divider: true },
    { label: 'ยอดคงเหลือยกไป', value: fmt(d?.closingBalance ?? 0) }
  ]
})

function onPrint (): void {
  router.push({ name: 'DailySummaryDetailPrintPage', params: { id: route.params.id } })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
