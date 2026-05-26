import type { ComponentOptions } from 'vue'
import type { NavigationFailure, RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, isNavigationFailure } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { updateFromRoute } from '@/utils/RouterHeader'
import ActionLogRouter from './modules/action-log'
import AnnouncementRouter from './modules/announcement'
import AssetRouter from './modules/asset'
import AuthRouter from './modules/Auth.router'
import ContractRouter from './modules/contract'
import CustomerRouter from './modules/customer'
import DashboardRouter from './modules/dashboard'
import FinanceRouter from './modules/finance'
import ReportsRouter from './modules/reports'
import SettingRouter from './modules/setting'
import StockRouter from './modules/stock'
import WorkRouter from './modules/work'

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
      layout: 'blank'
    }
  },
  {
    path: '/not-available',
    name: 'NotAvailablePage',
    component: (): ComponentOptions => import('@/pages/common/pages/not-available/pages/NotAvailablePage.vue'),
    meta: {
      layout: 'blank'
    }
  },
  AuthRouter,
  AnnouncementRouter,
  WorkRouter,
  DashboardRouter,
  ReportsRouter,
  ContractRouter,
  CustomerRouter,
  AssetRouter,
  FinanceRouter,
  StockRouter,
  ActionLogRouter,
  SettingRouter,
  {
    // Catch-all route for 404
    path: '/:pathMatch(.*)*', // Matches any path
    name: 'NotFound',
    component: (): ComponentOptions => import('@/pages/common/pages/not-found/pages/NotFoundPage.vue'),
    meta: {
      layout: 'blank'
    }
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

const DEFAULT_TITLE: string = 'Mittae Siam Management'

router.afterEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, failure: NavigationFailure | void | undefined): void => {
  if (isNavigationFailure(failure)) return
  document.title = to?.meta?.title ? `${DEFAULT_TITLE} | ${to.meta.title}` : DEFAULT_TITLE
  void updateFromRoute(to)
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
