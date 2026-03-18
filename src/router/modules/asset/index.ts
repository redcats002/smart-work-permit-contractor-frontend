import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/assets'

export default {
  history: prefix,
  path: prefix,
  name: 'AssetPage',
  redirect: { name: 'AssetListPage' },
  component: (): ComponentOptions => import('@/pages/asset/Asset.vue'),
  meta: {
    title: 'หลักทรัพย์',
    auth: true,
    icon: 'iconoir:box-iso'
  },
  children: [
    {
      path: 'list',
      name: 'AssetListPage',
      component: (): ComponentOptions => import('@/pages/asset/pages/list/pages/AssetListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการหลักทรัพย์',
        icon: 'iconoir:box-iso'
      }
    },
    {
      path: ':id',
      name: 'AssetDetailPage',
      component: (): ComponentOptions => import('@/pages/asset/pages/detail/pages/AssetDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดหลักทรัพย์',
        icon: 'iconoir:box-iso',
        back: { name: 'AssetListPage' }
      }
    }
  ]
} as RouteRecordRaw
