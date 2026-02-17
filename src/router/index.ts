import type { ComponentOptions } from 'vue'
import type { RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

// import { useAuthStore } from '@/stores/Auth'

// import AuthRouter from './modules/Auth.router'

export interface IRouteRedirect {
  name: string
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: (): ComponentOptions => import('@/pages/HomePage.vue')
  }
  // AuthRouter
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

const DEFAULT_TITLE: string = 'Title Website' // TODO: Change this

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
