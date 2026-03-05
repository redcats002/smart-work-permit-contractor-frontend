<template>
  <aside class="w-64 h-screen bg-white border-r border-r-(--p-gray-5) flex flex-col p-4">
    <!-- Logo Section -->
    <div class="border-b border-b-(--p-red)">
      <div class="flex justify-center mb-2">
        <img
          class="h-12"
          src="/logo.svg">
      </div>
      <p class="text-sm text-(--p-red) flex justify-center items-center gap-2 my-2">
        สาขา : <span>ขอนแก่น</span>
        <Icon
          class="text-font-gray cursor-pointer hover:text-black transition-all duration-200"
          icon="iconamoon:exit"
          @click="logout()" />
      </p>
    </div>

    <nav class="flex flex-col flex-1 overflow-y-auto">
      <!-- Top Menu -->
      <div class="space-y-1">
        <AppDrawerMenu
          v-for="menu in menuItems"
          :key="`top-${menu.label}`"
          :icon="menu.icon"
          :label="menu.label"
          :to="menu.to" />
      </div>

      <!-- Bottom Menu -->
      <div class="space-y-1 mt-auto">
        <AppDrawerMenu
          v-for="menu in buttomMenuItems"
          :key="`bottom-${menu.label}`"
          :icon="menu.icon"
          :label="menu.label"
          :to="menu.to" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import useLogout from '@/pages/auth/composables/useLogout'
import { Icon } from '@iconify/vue'
import AppDrawerMenu from './AppDrawerMenu.vue'

const { logout } = useLogout()

const menuItems = [
  { label: 'ข่าวสาร', icon: '/menuicon/news.svg', key: 'news', to: '/news' },
  { label: 'งาน', icon: '/menuicon/box.svg', key: 'jobs', to: '/jobs' },
  { label: 'แดชบอร์ด', icon: '/menuicon/dashbord.svg', key: 'dashboard', to: '/' },
  { label: 'รายงาน', icon: '/menuicon/report.svg', key: 'reports', to: '/reports' },
  { label: 'สัญญา', icon: '/menuicon/contract.svg', key: 'contracts', to: '/contracts' },
  { label: 'ลูกค้า', icon: '/menuicon/customer.svg', key: 'customers', to: '/customer/list' },
  { label: 'หลักทรัพย์', icon: '/menuicon/box.svg', key: 'assets', to: '/assets' },
  { label: 'เอกสารและการเงิน', icon: '/menuicon/document.svg', key: 'finance', to: '/finance' },
  { label: 'การจัดเก็บ', icon: '/menuicon/storage.svg', key: 'storage', to: '/storage' }
]
const buttomMenuItems = [
  { label: 'ตั่งค่า', icon: '/menuicon/setting.svg', key: 'setting', to: '/setting' }
]

</script>
