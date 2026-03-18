import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'employee'

export default {
  path: prefix,
  history: prefix,
  name: 'EmployeePage',
  redirect: { name: 'EmployeeListPage' },
  component: (): ComponentOptions => import('@/pages/employee/Employee.vue'),
  meta: {
    title: 'พนักงาน',
    auth: true,
    setting: true
  },
  children: [
    {
      path: 'list',
      name: 'EmployeeListPage',
      component: (): ComponentOptions => import('@/pages/employee/pages/list/pages/EmployeeListPage.vue'),
      meta: {
        auth: true,
        title: 'รายการพนักงาน',
        back: { name: 'SettingListPage' }
      }
    },
    {
      path: 'create',
      name: 'EmployeeCreatePage',
      component: (): ComponentOptions => import('@/pages/employee/pages/create/pages/EmployeeCreatePage.vue'),
      meta: {
        auth: true,
        title: 'เพิ่มพนักงานใหม่',
        back: { name: 'EmployeeListPage' }
      }
    },
    {
      path: 'detail/:id',
      name: 'EmployeeDetailPage',
      component: (): ComponentOptions => import('@/pages/employee/pages/detail/pages/EmployeeDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดพนักงาน',
        back: { name: 'EmployeeListPage' }
      }
    },
    {
      path: 'edit/:id',
      name: 'EmployeeEditPage',
      component: (): ComponentOptions => import('@/pages/employee/pages/edit/pages/EmployeeEditPage.vue'),
      meta: {
        auth: true,
        title: 'แก้ไขพนักงาน',
        back: { name: 'EmployeeDetailPage' }
      }
    }
  ]
} as RouteRecordRaw
