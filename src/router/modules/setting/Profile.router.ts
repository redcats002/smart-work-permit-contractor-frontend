import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'profile'

export default {
  path: prefix,
  history: prefix,
  name: 'ProfilePage',
  redirect: { name: 'ProfileDetailPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/profile/ProfilePage.vue'),
  meta: {
    title: 'โปรไฟล์',
    auth: true
  },
  children: [
    {
      path: 'detail',
      name: 'ProfileDetailPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/profile/pages/detail/pages/ProfileDetailPage.vue'),
      meta: {
        auth: true,
        title: 'โปรไฟล์',
        back: { name: 'SettingPage' }
      }
    },
    {
      path: 'edit',
      name: 'ProfileEditPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/profile/pages/edit/pages/ProfileEditPage.vue'),
      meta: {
        auth: true,
        title: 'แก้ไขข้อมูลโปรไฟล์',
        back: { name: 'ProfileDetailPage' }
      }
    }
  ]
} as RouteRecordRaw
