import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/work'

export default {
  path: prefix,
  name: 'WorkPage',
  redirect: { name: 'WorkListPage' },
  component: (): ComponentOptions => import('@/pages/work/WorkPage.vue'),
  meta: { title: 'บันทึกการเข้าถึงระบบ', auth: true, icon: 'material-symbols:history' },
  children: [
    {
      path: 'asset-appraisal',
      name: 'AssetAppraisalPage',
      component: (): ComponentOptions => import('@/pages/work/pages/asset-appraisal/pages/AssetAppraisalPage.vue'),
      meta: { auth: true, menu: true, title: 'บันทึกการเข้าถึงระบบ', icon: 'material-symbols:history' }
    },
    {
      path: 'follow-up',
      name: 'FollowUpPage',
      component: (): ComponentOptions => import('@/pages/work/pages/follow-up/pages/FollowUpPage.vue'),
      meta: { auth: true, menu: true, title: 'บันทึกการเข้าถึงระบบ', icon: 'material-symbols:history' }
    }
  ]
} as RouteRecordRaw
