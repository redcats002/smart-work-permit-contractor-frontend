import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import HowDidFindUsRouter from './HowDidFindUs.router'
import WarehouseRouter from './Warehouse.router'

const prefix = 'other'

export default {
  history: prefix,
  path: prefix,
  name: 'OtherSettingPage',
  redirect: { name: 'HowDidFindUsListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/other/OtherSetting.vue'),
  meta: {
    title: 'อื่น ๆ',
    auth: true,
    setting: true,
    icon: 'bitcoin-icons:sign-outline'
  },
  children: [
    HowDidFindUsRouter,
    WarehouseRouter
  ]
} as RouteRecordRaw
