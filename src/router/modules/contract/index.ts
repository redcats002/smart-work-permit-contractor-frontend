import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/contract'

export default {
  path: prefix,
  name: 'ContractPage',
  redirect: { name: 'ContractListPage' },
  component: (): ComponentOptions => import('@/pages/contract/Contract.vue'),
  meta: { title: 'สัญญา', auth: true, icon: 'solar:document-bold' },
  children: [
    {
      path: 'list',
      name: 'ContractListPage',
      component: (): ComponentOptions =>
        import('@/pages/contract/pages/list/pages/ContractListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการสัญญา', icon: 'solar:document-bold' }
    },
    {
      path: 'detail',
      name: 'ContractDetailPage',
      component: (): ComponentOptions =>
        import('@/pages/contract/pages/detail/pages/ContractDetailPage.vue'),
      meta: { auth: true, menu: true, title: 'รายละเอียดสัญญา', icon: 'solar:document-bold' }
    },
    {
      path: 'pre-contract/create',
      name: 'PreContractCreatePage',
      component: (): ComponentOptions =>
        import('@/pages/contract/pages/create/pages/PreContractCreatePage.vue'),
      meta: {
        auth: true,
        title: 'สร้างสัญญาใหม่',
        back: { name: 'ContractListPage' }
      }
    },
    {
      path: 'pre-contract/:id',
      name: 'PreContractDetailPage',
      component: (): ComponentOptions =>
        import('@/pages/contract/pages/pre-contract-detail/pages/PreContractDetailPage.vue'),
      meta: {
        auth: true,
        title: 'รายละเอียดสัญญา',
        back: { name: 'ContractListPage' }
      }
    }
  ]
} as RouteRecordRaw
