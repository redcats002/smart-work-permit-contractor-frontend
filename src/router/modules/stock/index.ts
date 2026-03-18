import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/stock'

export default {
  history: prefix,
  path: prefix,
  name: 'StockPage',
  redirect: { name: 'StockListPage' },
  component: (): ComponentOptions => import('@/pages/stock/Stock.vue'),
  meta: {
    title: 'รายการเอกสารหลักทรัพย์',
    auth: true,
    icon: 'mdi-account-cog-outline'
  },
  children: [
    {
      path: 'list',
      name: 'StockListPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/list/pages/StockListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการเอกสารหลักทรัพย์',
        icon: 'mdi-account'
      }
    },
    {
      path: 'docs/list',
      name: 'StockDocsListPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/list/pages/StockDocsListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการย้ายเอกสาร',
        icon: 'mdi-account'
      }
    },
    {
      path: 'docs/create',
      name: 'StockDocsCreatePage',
      component: (): ComponentOptions => import('@/pages/stock/pages/create/pages/StockDocsCreatePage.vue'),
      meta: {
        auth: true,
        title: 'สร้างย้ายเอกสารใหม่',
        icon: 'mdi-account',
        back: { name: 'CustomerListPage' }
      }
    },
    // {
    //   path: 'docs/select/list',
    //   name: 'StockDocsSelectPage',
    //   component: (): ComponentOptions => import('@/pages/stock/pages/create/pages/StockDocsSelectListPage.vue'),
    //   meta: {
    //     auth: true,
    //     title: 'เพิ่มเอกสารที่ต้องการย้าย',
    //     icon: 'mdi-account',
    //     back: { name: 'CustomerListPage' }
    //   }
    // },
    {
      path: ':id',
      name: 'StockDetailPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/detail/pages/StockDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดใบย้าย',
        icon: 'mdi-account',
        back: { name: 'CustomerListPage' }
      }
    }
  ]
} as RouteRecordRaw
