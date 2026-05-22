import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/announcement'

export default {
  path: prefix,
  name: 'AnnouncementPage',
  redirect: { name: 'AnnouncementPostPage' },
  component: (): ComponentOptions => import('@/pages/announcement/Announcement.vue'),
  meta: { title: 'ข่าวสาร', auth: true, icon: 'iconamoon:news', permission: 'news' },
  children: [
    {
      path: '/announcement',
      name: 'AnnouncementPostPage',
      component: (): ComponentOptions => import('@/pages/announcement/pages/AnnouncementPage.vue'),
      meta: { auth: true, menu: true, title: 'ข่าวสาร', icon: 'iconamoon:news' }
    }
  ]
} as RouteRecordRaw
