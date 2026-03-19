import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'branch-income-expense'

export default {
  path: prefix,
  name: 'BranchIncomeExpensePage',
  redirect: { name: 'BranchIncomeExpenseListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/branch-income-expense/BranchIncomeExpensePage.vue'),
  meta: {
    title: 'รายงานการรับ/จ่ายประจำสาขา',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'BranchIncomeExpenseListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/branch-income-expense/pages/BranchIncomeExpenseListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานการรับ/จ่ายประจำสาขา',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
