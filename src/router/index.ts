import type { ComponentOptions } from 'vue'
import type { NavigationFailure, RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, isNavigationFailure } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { updateFromRoute } from '@/utils/RouterHeader'
import AuthRouter from './modules/Auth.router'
import CertificateRouter from './modules/Certificate.router'
import HistoryRouter from './modules/History.router'
import PermitRouter from './modules/Permit.router'
import ProfileRouter from './modules/Profile.router'

export interface IRouteRedirect {
  name: string
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: (): ComponentOptions => import('@/pages/HomePage.vue')
  },
  {
    path: '/not-permitted',
    name: 'NotPermittedPage',
    component: (): ComponentOptions => import('@/pages/common/pages/not-permitted/pages/NotPermittedPage.vue'),
    meta: {
      layout: 'blank',
      // wayfinder ticket 030 — every route gets its own <title>, this one included; it used to
      // fall back to the bare "e-safework" default like every other unset route.
      title: 'ไม่มีสิทธิ์เข้าถึง'
    }
  },
  {
    path: '/not-available',
    name: 'NotAvailablePage',
    component: (): ComponentOptions => import('@/pages/common/pages/not-available/pages/NotAvailablePage.vue'),
    meta: {
      layout: 'blank',
      title: 'ไม่พร้อมใช้งาน'
    }
  },
  AuthRouter,
  PermitRouter,
  HistoryRouter,
  CertificateRouter,
  ProfileRouter,
  {
    // Catch-all route for 404
    path: '/:pathMatch(.*)*', // Matches any path
    name: 'NotFound',
    component: (): ComponentOptions => import('@/pages/common/pages/not-found/pages/NotFoundPage.vue'),
    meta: {
      layout: 'blank',
      title: 'ไม่พบหน้าที่ต้องการ'
    }
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

// Suffixed so the two apps are tellable apart in the tab strip. Wayfinder 055 gives them
// independent sessions, so both being open at once is now the expected case, not an edge one.
const DEFAULT_TITLE: string = 'e-safework Contractor'

export let previousRoutePath: string | null = null

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized, failure: NavigationFailure | void | undefined): void => {
  if (isNavigationFailure(failure)) return
  document.title = to?.meta?.title ? `${DEFAULT_TITLE} | ${to.meta.title}` : DEFAULT_TITLE
  void updateFromRoute(to)
  previousRoutePath = from.fullPath
})

router.onError((error: Error, to: RouteLocationNormalized): void => {
  const isChunkLoadError
    = error.message.includes('Failed to fetch dynamically imported module')
      || error.message.includes('Importing a module script failed')
      || error.message.includes('Unable to preload CSS')

  if (isChunkLoadError) {
    const key = `chunk-retry:${to.fullPath}`
    const retries = Number(sessionStorage.getItem(key) || 0)
    if (retries < 2) {
      sessionStorage.setItem(key, String(retries + 1))
      window.location.assign(to.fullPath)
    } else {
      sessionStorage.removeItem(key)
    }
  }
})

router.beforeEach((to: RouteLocationNormalized) => {
  const userStore = useAuthStore()
  const userToken: string = userStore?.userToken.accessToken

  if (to?.meta?.auth && !userToken) {
    return { name: 'LoginPage' }
  }
  return true
})

export default router
