import type { ComponentOptions } from 'vue'
import type { RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import AuthRouter from './modules/Auth.router'
import CustomerRouter from './modules/customer'
import SettingRouter from './modules/setting'

// import { useAuthStore } from '@/stores/Auth'


export interface IRouteRedirect {
  name: string
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: (): ComponentOptions => import('@/pages/HomePage.vue')
  },
  AuthRouter,
  CustomerRouter,
  SettingRouter
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

const DEFAULT_TITLE: string = 'Mittae Siam Management'

router.afterEach((to: RouteLocationNormalized): void => {
  document.title = to?.meta?.title ? `${DEFAULT_TITLE} | ${to.meta.title}` : DEFAULT_TITLE
})

// router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void => {
//   const userStore = useAuthStore()
//   const userToken: string = userStore?.userToken.accessToken

//   if (to?.meta?.auth && !userToken) {
//     router.replace({ name: 'LoginPage' })
//     return
//   }
//   next()
// })

export default router
