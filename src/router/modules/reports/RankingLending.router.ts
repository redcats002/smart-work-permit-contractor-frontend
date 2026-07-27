import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'ranking-lending'

export default {
  path: prefix,
  name: 'RankingLendingPage',
  redirect: { name: 'RankingLendingListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/ranking-lending/RankingLendingPage.vue'),
  meta: {
    title: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'RankingLendingListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/ranking-lending/page/RankingLendingListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'RankingLendingPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/ranking-lending/page/RankingLendingPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานอันดับ 1-25 การปล่อยสินเชื่อ',
        layout: 'blank',
        back: { name: 'RankingLendingListPage' }
      }
    }
  ]
} as RouteRecordRaw
