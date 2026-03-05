import type { RouteRecordRaw } from 'vue-router'

const prefix = 'other'

export default {
  history: prefix,
  path: prefix,
  // name: 'OtherSettingPage',
  // redirect: { name: 'OtherSettingListPage' },
  meta: {
    title: 'อื่น ๆ',
    auth: true,
    setting: true,
    icon: 'bitcoin-icons:sign-outline'
  },
  children: []
} as RouteRecordRaw
