import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import ContractSettingRouter from './ContractSetting.router'
import CustomerSettingRouter from './CustomerSetting.router'
import FinancialSettingRouter from './FinancialSetting.router'
import OtherSettingRouter from './other'

const prefix = '/setting'

export default {
  history: prefix,
  path: prefix,
  name: 'SettingPage',
  redirect: { name: 'SettingListPage' },
  component: (): ComponentOptions => import('@/pages/setting/Setting.vue'),
  meta: {
    title: 'ตั้งค่า',
    auth: true,
    icon: 'lsicon:setting-outline',
    permission: 'settings'
  },
  children: [
    {
      path: 'list',
      name: 'SettingListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/list/pages/SettingListPage.vue'),
      meta: {
        auth: true,
        title: 'ตั้งค่า'
      }
    },
    ContractSettingRouter,
    CustomerSettingRouter,
    FinancialSettingRouter,
    OtherSettingRouter
  ]
} as RouteRecordRaw
