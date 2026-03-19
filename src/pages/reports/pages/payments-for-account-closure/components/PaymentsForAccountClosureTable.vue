<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>วันที่</th>
          <th>เลขที่ใบเสร็จ</th>
          <th>เลขที่สัญญา</th>
          <th>ชื่อลูกค้า</th>
          <th>การชำระ</th>
          <th class="text-end">
            ยอดตัดลูกหนี้
          </th>
          <th class="text-end">
            ส่วนลด
          </th>
          <th class="text-end">
            ยอดรับสุทธิ
          </th>
          <th class="text-end">
            ดอกเบี้ยรับ
          </th>
          <th>หมวดหมู่</th>
        </tr>
      </thead>

      <tbody>
        <template
          v-for="item in items"
          :key="item.id">
          <tr
            v-for="(row, index) in item.items"
            :key="index">
            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1">
              {{ dayjs.formatDate(item.date) }}
            </td>

            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1"
              class="text-red-500">
              {{ item.receipt.idNo }}
            </td>

            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1"
              class="text-red-500">
              {{ item.contract.idNo }}
            </td>

            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1">
              {{ formatter.fullName(item.customer) }}
            </td>

            <!-- DETAIL -->
            <td class="border-b text-end">
              {{ row.paymentMethod }}
            </td>

            <td class="text-end border-b">
              {{ formatter.numberFormat(row.cutBalance) }}
            </td>
            <td class="text-end border-b">
              {{ formatter.numberFormat(row.discount) }}
            </td>
            <td class="text-end border-b">
              {{ formatter.numberFormat(row.total) }}
            </td>

            <!-- RIGHT GROUP -->
            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1"
              class="text-end">
              {{ formatter.numberFormat(item.interest) }}
            </td>

            <td
              v-if="index === 0"
              :rowspan="item.items.length + 1">
              {{ item.category }}
            </td>
          </tr>

          <!-- TOTAL ROW -->
          <tr class="font-bold">
            <td class="text-end">
              รวม
            </td>
            <td class="text-end">
              {{ formatter.numberFormat(sum(item.items, 'cutBalance')) }}
            </td>
            <td class="text-end">
              {{ formatter.numberFormat(sum(item.items, 'discount')) }}
            </td>
            <td class="text-end">
              {{ formatter.numberFormat(sum(item.items, 'total')) }}
            </td>
          </tr>
        </template>
      </tbody>

      <tfoot>
        <tr class="bg-[#E0E0E0]">
          <td />
          <td />
          <td />
          <td>รวมทั้งสิ้น {{ items.length }} รายการ</td>
          <td class="text-end">
            <!-- HARDCODE -->
            {{ formatter.numberFormat(120000) }}
          </td>
          <td class="text-end">
            <!-- HARDCODE -->
            {{ formatter.numberFormat(120000) }}
          </td>
          <td class="text-end">
            <!-- HARDCODE -->
            {{ formatter.numberFormat(120000) }}
          </td>
          <td class="text-end">
            <!-- HARDCODE -->
            {{ formatter.numberFormat(120000) }}
          </td>
          <td class="text-end">
            <!-- HARDCODE -->
            {{ formatter.numberFormat(120000) }}
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IAccountClosureList } from '@/models/response/report/account-closure/AccountClosureRes.model'

interface IProps {
  items: IAccountClosureList[]
}

defineProps<IProps>()

const dayjs = useDayjs()

function sum (arr: any[], key: string): any {
  return arr.reduce((acc: number, cur: any): any => acc + (cur[key] || 0), 0)
}

</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
  color: #111827;
}

.table th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.table tbody {
  background-color: #fafafa;
}

.font-bold {
  font-weight: 600;
}

.p-2 {
  padding: 8px;
}

.border-b {
  border-bottom: 1px solid #E0E0E0 !important;
}

.rounded-lg {
  border-radius: 8px;
}

.table-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>
