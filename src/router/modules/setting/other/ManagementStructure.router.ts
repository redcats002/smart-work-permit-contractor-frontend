import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'management-structure'

export default {
  history: prefix,
  path: prefix,
  name: 'ManagementStructurePage',
  redirect: { name: 'ManagementStructureListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/management-structure/ManagementStructure.vue'),
  meta: {
    title: 'ผังบริหาร',
    auth: true
  },
  children: [
    {
      path: 'list',
      name: 'ManagementStructureListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/management-structure/pages/ManagementStructureListPage.vue'),
      meta: {
        auth: true,
        title: 'ผังบริหาร',
        back: { name: 'SettingListPage' }
      }
    }
  ]
} as RouteRecordRaw
