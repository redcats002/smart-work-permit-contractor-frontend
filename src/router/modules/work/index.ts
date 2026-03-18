import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/work'

export default {
  path: prefix,
  name: 'WorkPage',
  redirect: { name: 'WorkListPage' },
  component: (): ComponentOptions => import('@/pages/work/WorkPage.vue'),
  meta: { title: 'งาน', auth: true, icon: 'material-symbols:work-history-rounded' },
  children: [
    {
      path: 'asset-appraisal',
      name: 'AssetAppraisalPage',
      component: (): ComponentOptions => import('@/pages/work/pages/asset-appraisal/pages/AssetAppraisalPage.vue'),
      meta: { auth: true, menu: true, title: 'ประเมินหลักทรัพย์', icon: 'material-symbols:work-history-rounded' }
    },
    {
      path: 'follow-up',
      name: 'FollowUpPage',
      component: (): ComponentOptions => import('@/pages/work/pages/follow-up/pages/FollowUpPage.vue'),
      meta: { auth: true, menu: true, title: 'ติดตามทวงถาม', icon: 'material-symbols:work-history-rounded' }
    }
  ]
} as RouteRecordRaw
