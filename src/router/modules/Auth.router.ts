import { type ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/auth',
  name: 'AuthPage',
  redirect: {
    name: 'LoginPage'
  },
  component: (): ComponentOptions => import('@/pages/auth/Auth.vue'),
  meta: {
    title: 'เข้าสู่ระบบ',
    layout: 'blank'
  },
  children: [
    {
      path: 'login',
      name: 'LoginPage',
      component: (): ComponentOptions => import('@/pages/auth/pages/login/pages/LoginPage.vue'),
      meta: {
        layout: 'blank'
      }
    }
    // {
    //   path: 'forgot-password',
    //   name: 'ForgotPasswordPage',
    //   component: (): ComponentOptions => import('@/pages/auth/pages/ForgotPasswordPage.vue'),
    //   meta: {
    //     layout: 'blank'
    //   }
    // },
    // {
    //   path: 'reset-password',
    //   name: 'ResetPasswordPage',
    //   component: (): ComponentOptions => import('@/pages/auth/pages/ResetPasswordPage.vue'),
    //   meta: {
    //     layout: 'blank'
    //   }
    // }
  ]
} as RouteRecordRaw
