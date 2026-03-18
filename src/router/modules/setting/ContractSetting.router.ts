import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'contract'

export default {
  history: prefix,
  path: prefix,
  name: 'ContractSettingPage',
  redirect: { name: 'ContractLoanTypeListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/contract/ContractSetting.vue'),
  meta: {
    title: 'สัญญา',
    auth: true,
    setting: true,
    icon: 'bitcoin-icons:sign-outline'
  },
  children: [
    {
      path: 'contract-loan-type/list',
      name: 'ContractLoanTypeListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/contract/pages/contract-loan-type/pages/ContractLoanTypeListPage.vue'),
      meta: {
        auth: true,
        title: 'ประเภทเงินกู้',
        back: { name: 'SettingListPage' }
      }
    },
    {
      path: 'contract-loan-purpose/list',
      name: 'ContractLoanPurposeListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/contract/pages/contract-loan-purpose/pages/ContractLoanPurposeListPage.vue'),
      meta: {
        auth: true,
        title: 'วัตถุประสงค์เงินกู้',
        back: { name: 'SettingListPage' }
      }
    }
  ]
} as RouteRecordRaw
