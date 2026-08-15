import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * NOT yet registered in src/router/index.ts — that file is owned by another agent
 * during this wave (see CRT-002 task notes). Wire this module in there once available.
 */
const prefix = '/certificates'

export default {
  path: prefix,
  component: (): ComponentOptions => import('@/pages/certificate/CertificatePage.vue'),
  meta: {
    layout: 'default',
    auth: true,
    // route meta.title is read as a raw string by src/router/index.ts's afterEach
    // (document.title = to.meta.title) — not run through t() — same convention as
    // src/router/modules/Permit.router.ts. Mirrors src/locales/th/certificate.ts's title.
    title: 'ใบรับรองการทำงาน'
  },
  children: [
    {
      path: '',
      name: 'CertificateListPage',
      component: (): ComponentOptions => import('@/pages/certificate/pages/list/pages/CertificateListPage.vue'),
      meta: {
        title: 'ใบรับรองการทำงาน'
      }
    }
  ]
} as RouteRecordRaw
