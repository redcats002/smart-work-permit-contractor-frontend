import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import EmployeeRouter from '../Employee.router'
import BranchRouter from './Branch.router'
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
    icon: 'hugeicons:list-setting'
  },
  children: [
    EmployeeRouter,
    WarehouseRouter,
    BranchRouter,
    HowDidFindUsRouter
  ]
} as RouteRecordRaw
