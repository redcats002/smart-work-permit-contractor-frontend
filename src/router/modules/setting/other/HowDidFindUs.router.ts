import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'how-did-find-us'

export default {
  history: prefix,
  path: prefix,
  name: 'HowDidFindUsPage',
  redirect: { name: 'HowDidFindUsListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/how-did-find-us/HowDidFindUs.vue'),
  meta: {
    title: 'รู้จักมิตรแท้จากที่ไหน',
    auth: true
  },
  children: [
    {
      path: 'list',
      name: 'HowDidFindUsListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/how-did-find-us/pages/HowDidFindUsListPage.vue'),
      meta: {
        auth: true,
        title: 'รู้จักมิตรแท้จากที่ไหน',
        back: { name: 'SettingListPage' }
      }
    }
  ]
} as RouteRecordRaw
