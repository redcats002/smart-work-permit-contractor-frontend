import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/customer'

export default {
  history: prefix,
  path: prefix,
  name: 'CustomerPage',
  redirect: { name: 'CustomerListPage' },
  component: (): ComponentOptions => import('@/pages/customer/Customer.vue'),
  meta: {
    title: 'ลูกค้า',
    auth: true,
    icon: 'solar:user-linear',
    permission: 'customers'
  },
  children: [
    {
      path: 'list',
      name: 'CustomerListPage',
      component: (): ComponentOptions => import('@/pages/customer/pages/list/pages/CustomerListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการลูกค้า',
        icon: 'mdi-account'
      }
    },
    {
      path: 'create',
      name: 'CustomerCreatePage',
      component: (): ComponentOptions => import('@/pages/customer/pages/create/pages/CustomerCreatePage.vue'),
      meta: {
        auth: true,
        title: 'เพิ่มลูกค้า',
        icon: 'mdi-account',
        back: { name: 'CustomerListPage' }
      }
    },
    {
      path: ':id',
      name: 'CustomerDetailPage',
      component: (): ComponentOptions => import('@/pages/customer/pages/detail/pages/CustomerDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดลูกค้า',
        icon: 'mdi-account',
        back: { name: 'CustomerListPage' }
      }
    },
    {
      path: 'edit/:id',
      name: 'CustomerEditPage',
      component: (): ComponentOptions => import('@/pages/customer/pages/edit/pages/CustomerEditPage.vue'),
      meta: {
        auth: true,
        title: 'แก้ไขรายละเอียดลูกค้า',
        icon: 'mdi-account',
        back: { name: 'CustomerDetailPage' }
      }
    }
  ]
} as RouteRecordRaw
