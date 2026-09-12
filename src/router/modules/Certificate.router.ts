import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Registered in src/router/index.ts. (The comment that used to sit here claimed the opposite,
 * left over from the CRT-002 wave; History.router.ts carried the identical stale claim. Both
 * were wired long ago — wayfinder 057.)
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
    },
    {
      // `:id` and `:id/edit`, matching Permit.router.ts. The list card links here; before
      // wayfinder 057 the card had no click handler at all and there was no detail route.
      path: ':id',
      name: 'CertificateDetailPage',
      component: (): ComponentOptions => import('@/pages/certificate/pages/detail/pages/CertificateDetailPage.vue'),
      meta: {
        title: 'รายละเอียดใบรับรอง'
      }
    },
    {
      path: ':id/edit',
      name: 'CertificateEditPage',
      component: (): ComponentOptions => import('@/pages/certificate/pages/edit/pages/CertificateEditPage.vue'),
      meta: {
        title: 'แก้ไขใบรับรอง'
      }
    }
  ]
} as RouteRecordRaw
