import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'branch'

export default {
  history: prefix,
  path: prefix,
  name: 'BranchPage',
  redirect: { name: 'BranchListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/branch/Branch.vue'),
  meta: {
    title: 'สาขา',
    auth: true
  },
  children: [
    {
      path: 'list',
      name: 'BranchListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/branch/pages/list/pages/BranchListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการสาขา',
        back: { name: 'SettingListPage' }
      }
    },
    {
      path: 'create',
      name: 'BranchCreatePage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/branch/pages/create/pages/BranchCreatePage.vue'),
      meta: {
        auth: true,
        title: 'เพิ่มสาขาใหม่',
        back: { name: 'BranchListPage' }
      }
    },
    {
      path: ':id',
      name: 'BranchDetailPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/branch/pages/detail/pages/BranchDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดสาขา',
        back: { name: 'BranchListPage' }
      }
    },
    {
      path: 'edit/:id',
      name: 'BranchEditPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/branch/pages/edit/pages/BranchEditPage.vue'),
      meta: {
        auth: true,
        title: 'แก้ไขสาขา',
        back: { name: 'BranchDetailPage' }
      }
    }
  ]
} as RouteRecordRaw
