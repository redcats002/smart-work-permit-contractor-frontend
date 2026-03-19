import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'ranking-loan'

export default {
  path: prefix,
  name: 'RankingLoanPage',
  redirect: { name: 'RankingLoanListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/ranking-loan/RankingLoanPage.vue'),
  meta: {
    title: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'RankingLoanListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/ranking-loan/page/RankingLoanListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานอันดับ 1-25 การรับสินเชื่อ',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
