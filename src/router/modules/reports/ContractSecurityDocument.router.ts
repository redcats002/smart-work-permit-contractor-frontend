import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'contract-security-document'

export default {
  path: prefix,
  name: 'ContractSecurityDocumentPage',
  redirect: { name: 'ContractSecurityDocumentListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/contact-security-document/ContractSecurityDocumentReportPage.vue'),
  meta: {
    title: 'รายงานสัญญาและเอกสารหลักทรัพย์',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'ContractSecurityDocumentListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/contact-security-document/pages/ContractSecurityDocumentReportListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสัญญาและเอกสารหลักทรัพย์',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'ContractSecurityDocumentPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/contact-security-document/pages/ContractSecurityDocumentReportPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานสัญญาและเอกสารหลักทรัพย์',
        layout: 'blank',
        back: { name: 'ContractSecurityDocumentListPage' }
      }
    }
  ]
} as RouteRecordRaw
