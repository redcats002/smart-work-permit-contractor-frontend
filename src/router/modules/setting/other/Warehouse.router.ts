import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'warehouse'

export default {
  history: prefix,
  path: prefix,
  name: 'WarehousePage',
  redirect: { name: 'WarehouseListPage' },
  component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/warehouse/Warehouse.vue'),
  meta: {
    title: 'รายการคลัง',
    auth: true
  },
  children: [
    {
      path: 'list',
      name: 'WarehouseListPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/warehouse/pages/list/pages/WarehouseListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการคลัง'
      }
    },
    {
      path: 'create',
      name: 'WarehouseCreatePage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/warehouse/pages/create/pages/WarehouseCreatePage.vue'),
      meta: {
        auth: true,
        title: 'เพิ่มคลัง',
        back: { name: 'WarehouseListPage' }
      }
    },
    {
      path: ':id',
      name: 'WarehouseDetailPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/warehouse/pages/detail/pages/WarehouseDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดคลัง',
        back: { name: 'WarehouseListPage' }
      }
    },
    {
      path: 'edit/:id',
      name: 'WarehouseEditPage',
      component: (): ComponentOptions => import('@/pages/setting/pages/other/pages/warehouse/pages/edit/pages/WarehouseEditPage.vue'),
      meta: {
        auth: true,
        title: 'แก้ไขคลัง',
        back: { name: 'WarehouseDetailPage' }
      }
    }
  ]
} as RouteRecordRaw
