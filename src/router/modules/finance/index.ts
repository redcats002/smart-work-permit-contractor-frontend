import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/finance'

export default {
  path: prefix,
  name: 'FinancePage',
  redirect: { name: 'InvoiceListPage' },
  component: (): ComponentOptions => import('@/pages/finance/Finance.vue'),
  meta: { title: 'เอกสารและการเงิน', auth: true, icon: 'solar:document-medicine-bold' },
  children: [
    {
      path: 'invoice/list',
      name: 'InvoiceListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/invoice/pages/InvoiceListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการใบแจ้งหนี้', icon: 'solar:bill-list-bold' }
    },
    {
      path: 'invoice/detail/:id',
      name: 'InvoiceDetailPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/invoice/pages/InvoiceDetailPage.vue'),
      meta: {
        auth: true,
        menu: false,
        title: 'รายละเอียดใบแจ้งหนี้',
        icon: 'solar:bill-list-bold',
        back: { name: 'InvoiceListPage' }
      }
    },


    {
      path: 'receipt/list',
      name: 'ReceiptListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/receipt/list/pages/ReceiptListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการใบเสร็จรับเงิน', icon: 'solar:bill-list-bold' }
    },
    {
      path: 'receipt/detail/:id',
      name: 'ReceiptDetailPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/receipt/detail/pages/ReceiptDetailPage.vue'),
      meta: { auth: true,
        menu: true,
        title: 'รายละเอียดใบเสร็จรับเงิน',
        icon: 'solar:bill-list-bold',
        back: { name: 'ReceiptListPage' }
      }
    },
    {
      path: 'receipt/create',
      name: 'ReceiptCreatePage',
      component: (): ComponentOptions => import('@/pages/finance/pages/receipt/create/pages/ReceiptListPage.vue'),
      meta: { auth: true,
        menu: true,
        title: 'สร้างใบเสร็จรับเงินใหม่',
        icon: 'solar:bill-list-bold',
        back: { name: 'ReceiptListPage' }
      }
    },

    {
      path: 'expense/list',
      name: 'ExpenseListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/record/list/pages/RecordExpensesListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายการบันทึกค่าใช้จ่าย',
        icon: 'solar:bill-list-bold'
      }
    },
    {
      path: 'expense/create',
      name: 'ExpenseCreatePage',
      component: (): ComponentOptions => import('@/pages/finance/pages/record/create/pages/RecordExpensesCreatePage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'เพิ่มบันทึกค่าใช้จ่ายใหม่',
        icon: 'solar:bill-list-bold',
        back: { name: 'ExpenseListPage' }
      }
    },
    {
      path: 'expense/detail/:id',
      name: 'ExpenseDetailPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/record/detail/pages/RecordExpensesDetailPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายละเอียดค่าใช้จ่าย',
        icon: 'solar:bill-list-bold',
        back: { name: 'ExpenseListPage' }
      }
    }
  ]
} as RouteRecordRaw
