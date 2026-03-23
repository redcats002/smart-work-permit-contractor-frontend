import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'financial'

export default {
  history: prefix,
  path: prefix,
  name: 'FinancialSettingPage',
  component: (): ComponentOptions => import('@/pages/setting/pages/financial/FinancialSetting.vue'),
  redirect: { name: 'IncomeCategoryListPage' },
  meta: {
    title: 'การเงิน',
    auth: true,
    setting: true,
    icon: 'iconoir:box-iso'
  },
  children: [
    {
      path: 'finance-income-category/list',
      name: 'IncomeCategoryListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/financial/pages/income-category/pages/IncomeCategoryListPage.vue'),
      meta: {
        auth: true,
        title: 'หมวดหมู่รายได้',
        back: { name: 'SettingListPage' }
      }
    },
    {
      path: 'finance-expense-category/list',
      name: 'ExpenseCategoryListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/financial/pages/expense-category/pages/ExpenseCategoryListPage.vue'),
      meta: {
        auth: true,
        title: 'หมวดหมู่รายจ่าย',
        back: { name: 'SettingListPage' }
      }
    }
  ]
} as RouteRecordRaw
