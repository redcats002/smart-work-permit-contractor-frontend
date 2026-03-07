import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'financial'

export default {
  history: prefix,
  path: prefix,
  name: 'FinancialSettingPage',
  component: (): ComponentOptions => import('@/pages/setting/pages/financial/FinancialSetting.vue'),
  // redirect: { name: 'FinancialSettingListPage' },
  meta: {
    title: 'การเงิน',
    auth: true,
    setting: true,
    icon: 'bitcoin-icons:sign-outline'
  },
  children: []
} as RouteRecordRaw
