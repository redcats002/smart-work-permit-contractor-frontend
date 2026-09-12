import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * wayfinder 077 — the "Getting started" static page + deep-linkable sections. Reached from the
 * drawer's own entry (see AppDrawer.vue's navItems) — this app has no header menu, so the drawer
 * is the only route in besides an inline link such as Step3WhereWhen's "what is this for?".
 */
const prefix = '/getting-started'

export default {
  path: prefix,
  meta: {
    layout: 'default',
    auth: true,
    title: 'เริ่มต้นใช้งาน'
  },
  children: [
    {
      path: '',
      name: 'GettingStartedPage',
      component: (): ComponentOptions => import('@/pages/guide/pages/GettingStartedPage.vue'),
      meta: {
        title: 'เริ่มต้นใช้งาน'
      }
    }
  ]
} as RouteRecordRaw
