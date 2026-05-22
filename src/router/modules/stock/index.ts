import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/stock'

export default {
  history: prefix,
  path: prefix,
  name: 'StockPage',
  redirect: { name: 'DocumentAssetListPage' },
  component: (): ComponentOptions => import('@/pages/stock/Stock.vue'),
  meta: {
    title: 'การจัดเก็บ',
    auth: true,
    icon: 'mdi-account-cog-outline'
  },
  children: [
    {
      path: 'asset/list',
      name: 'DocumentAssetListPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/list/pages/DocumentAssetListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการเอกสารหลักทรัพย์',
        icon: 'mdi-account'
      }
    },
    {
      path: 'movement/list',
      name: 'DocumentMovementListPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/list/pages/DocumentMovementListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการย้ายเอกสาร',
        menuTitle: 'ย้ายเอกสาร',
        icon: 'mdi-account'
      }
    },
    {
      path: 'movement/create',
      name: 'DocumentMovementCreatePage',
      component: (): ComponentOptions => import('@/pages/stock/pages/create/pages/DocumentMovementCreatePage.vue'),
      meta: {
        auth: true,
        title: 'สร้างย้ายเอกสารใหม่',
        icon: 'mdi-account',
        back: { name: 'DocumentMovementListPage' }
      }
    },
    {
      path: 'movement/:id',
      name: 'DocumentMovementDetailPage',
      component: (): ComponentOptions => import('@/pages/stock/pages/detail/pages/DocumentMovementDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดใบย้าย',
        icon: 'mdi-account',
        back: { name: 'DocumentMovementListPage' }
      }
    }
  ]
} as RouteRecordRaw
