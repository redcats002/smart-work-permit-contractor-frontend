import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

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
    {
      path: 'how-did-find-us/list',
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
