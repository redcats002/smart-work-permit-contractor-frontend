import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'financial-summary'

export default {
  path: prefix,
  name: 'FinancialSummaryPage',
  redirect: { name: 'FinancialSummaryPageListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/financial-summary/FinancialSummaryReportPage.vue'),
  meta: {
    title: 'รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'FinancialSummaryPageListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/financial-summary/pages/FinancialSummaryReportListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'FinancialSummaryPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/financial-summary/pages/FinancialSummaryReportPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานสรุปรับ / ปล่อยสินเชื่อ / ค่าใช้จ่าย',
        layout: 'blank',
        back: { name: 'FinancialSummaryPageListPage' }
      }
    }
  ]
} as RouteRecordRaw
