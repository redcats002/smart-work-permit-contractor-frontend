import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/profile'

export default {
  path: prefix,
  meta: {
    layout: 'default',
    auth: true,
    // route meta.title is read as a raw string by src/router/index.ts's afterEach
    // (document.title = to.meta.title) — not run through t() — same convention as
    // src/router/modules/Certificate.router.ts. Mirrors src/locales/th/profile copy.
    title: 'โปรไฟล์ของฉัน'
  },
  children: [
    {
      path: '',
      name: 'ProfileDetailPage',
      component: (): ComponentOptions => import('@/pages/profile/pages/ProfileDetailPage.vue'),
      meta: {
        title: 'โปรไฟล์ของฉัน'
      }
    }
  ]
} as RouteRecordRaw
