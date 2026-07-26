<template>
  <BasePrintPage
    :page-count="totalPages || 1"
    title="รายงานสัญญาและเอกสารหลักทรัพย์">
    <template #default="{ page }">
      <div
        v-if="!items.length"
        class="text-center py-16 text-zinc-500">
        ไม่มีข้อมูล
      </div>
      <table
        v-else
        class="w-full border-collapse border border-zinc-300 rounded-sm overflow-hidden">
        <thead>
          <tr class="bg-zinc-700 text-white">
            <th class="p-1.5 text-left text-[9px]">
              สาขา
            </th>
            <th class="p-1.5 text-center text-[9px]">
              จำนวนสัญญา
            </th>
            <th class="p-1.5 text-center text-[9px]">
              จำนวนปิดบัญชี
            </th>
            <th class="p-1.5 text-center text-[9px]">
              คงเหลือ
            </th>
            <th class="p-1.5 text-center text-[9px]">
              จำนวนโฉนดที่ดิน
            </th>
            <th class="p-1.5 text-center text-[9px]">
              น.ส. 3
            </th>
            <th class="p-1.5 text-center text-[9px]">
              น.ส. 3ก
            </th>
            <th class="p-1.5 text-center text-[9px]">
              รถยนต์
            </th>
            <th class="p-1.5 text-center text-[9px]">
              รถมอเตอร์ไซค์
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in pages[page]"
            :key="`${item.id}-${i}`"
            class="border-b border-zinc-200">
            <td class="p-1.5">
              {{ item.branchName }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.contractAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.contractCloseAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.contractPendingAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.assetLandAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.ns3Amount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.ns3kAmount) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.vehicle) }}
            </td>
            <td class="p-1.5 text-center">
              {{ formatter.numberFormat(item.motorcycle) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </BasePrintPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { IContractSecurityDocumentReportList } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
import BasePrintPage from '@/components/base/BasePrintPage.vue'

interface IProps {
  items: IContractSecurityDocumentReportList[]
}

const props = defineProps<IProps>()
const ROWS_PER_PAGE = 20

const totalPages = computed((): number => Math.ceil(props.items.length / ROWS_PER_PAGE))

const pages = computed((): IContractSecurityDocumentReportList[][] => {
  const result: IContractSecurityDocumentReportList[][] = []
  for (let i = 0; i < props.items.length; i += ROWS_PER_PAGE) {
    result.push(props.items.slice(i, i + ROWS_PER_PAGE))
  }
  return result
})
</script>

<style scoped></style>
