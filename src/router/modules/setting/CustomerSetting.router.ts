import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'customer'

export default {
  history: prefix,
  path: prefix,
  name: 'CustomerSettingPage',
  redirect: { name: 'CustomerGroupListPage' },
  meta: {
    title: 'ลูกค้า',
    auth: true,
    setting: true,
    icon: 'solar:user-linear'
  },
  children: [
    {
      path: 'customer-group/list',
      name: 'CustomerGroupListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/customer/pages/customer-group/pages/CustomerGroupListPage.vue'),
      meta: {
        auth: true,
        title: 'กลุ่มลูกค้า',
        back: { name: 'SettingListPage' }
      }
    },
    {
      path: 'occupation/list',
      name: 'OccupationListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/customer/pages/occupation/pages/OccupationListPage.vue'),
      meta: {
        auth: true,
        title: 'อาชีพ',
        back: { name: 'SettingListPage' }
      }
    }
  ]
} as RouteRecordRaw
