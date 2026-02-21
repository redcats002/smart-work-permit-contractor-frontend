export default {
  path: '/customer',
  component: (): any => import('@/pages/customer/CustomerPage.vue'),
  meta: {
    title: 'ลูกค้า',
    auth: true,
    icon: 'mdi-account-cog-outline'
    // allowedRoles: ['SUPER_ADMIN', 'ADMIN']
  },
  children: [
    {
      path: 'list',
      name: 'CustomerList',
      component: (): any => import('@/pages/customer/pages/CustomerList.vue'),
      meta: {
        auth: true,
        isMenu: true,
        title: 'รายการลูกค้า',
        icon: 'mdi-account'
        // allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALE'],
        // allowedPermissions: ['customer.read']
      }
    }
    // {
    //   path: 'create',
    //   name: 'CustomerCreate',
    //   component: (): any => import('@/views/customer/pages/CustomerCreatePage.vue'),
    //   meta: {
    //     auth: true,
    //     // isMenu: true,
    //     title: 'เพิ่มสมาชิก',
    //     icon: 'mdi-account',
    //     allowedPermissions: ['customer.create']
    //   }
    // },
    // {
    //   path: ':id',
    //   name: 'CustomerDetail',
    //   component: (): any => import('@/views/customer/pages/CustomerDetail.vue'),
    //   meta: {
    //     auth: true,
    //     // isMenu: true,
    //     title: 'รายละเอียดสมาชิก',
    //     icon: 'mdi-account',
    //     allowedPermissions: ['customer.read']
    //   }
    // },
    // {
    //   path: 'edit/:id',
    //   name: 'CustomerEdit',
    //   component: (): any => import('@/views/customer/pages/CustomerEdit.vue'),
    //   meta: {
    //     auth: true,
    //     // isMenu: true,
    //     title: 'แก้ไขสมาชิก',
    //     icon: 'mdi-account',
    //     allowedPermissions: ['customer.edit']
    //   }
    // }
  ]
}
