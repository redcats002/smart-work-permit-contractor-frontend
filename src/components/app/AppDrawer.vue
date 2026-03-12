<template>
  <!-- Sidebar
    Desktop : always visible, part of the normal flex flow (md:relative)
    Mobile  : fixed overlay that slides in from the left via translate-x
  -->
  <aside
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    class="fixed md:relative inset-y-0 left-0 z-50
           w-64 h-screen
           bg-white border-r border-r-(--p-gray-5)
           flex flex-col p-4
           transition-transform duration-300 ease-in-out">
    <!-- Logo Section -->
    <div class="border-b border-b-(--p-red)">
      <!-- Mobile close button -->
      <div class="flex md:hidden justify-end mb-1">
        <Icon
          class="size-6 text-font-gray cursor-pointer hover:text-black transition-all duration-200"
          icon="mdi:close"
          @click="close()" />
      </div>

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

    <nav
      class="flex flex-col flex-1 overflow-y-auto"
      @click="close()">
      <!-- Top Menu -->
      <div class="space-y-1">
        <template
          v-for="menu in menuItems"
          :key="`top-${menu.label}`">
          <AppDrawerSubMenu
            v-if="menu.children?.length"
            :children="menu.children"
            :icon="menu.icon"
            :label="menu.label" />
          <AppDrawerMenu
            v-else
            :icon="menu.icon"
            :label="menu.label"
            :to="menu.to!" />
        </template>
      </div>

      <!-- Bottom Menu -->
      <div class="space-y-1 mt-auto">
        <AppDrawerMenu
          v-for="menu in buttomMenuItems"
          :key="`bottom-${menu.label}`"
          :icon="menu.icon"
          :label="menu.label"
          :to="menu.to!" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import useLogout from '@/pages/auth/composables/useLogout'
import { useAppDrawer } from '@/composables/useAppDrawer'
import { Icon } from '@iconify/vue'
import AppDrawerMenu from './AppDrawerMenu.vue'
import AppDrawerSubMenu from './AppDrawerSubMenu.vue'

const { isOpen, close } = useAppDrawer()

const { logout } = useLogout()

interface IMenuItem {
  label: string
  icon: string
  key: string
  to?: string
  children?: { label: string, to: string }[]
}

const menuItems: IMenuItem[] = [
  { label: 'ข่าวสาร', icon: '/menuicon/news.svg', key: 'news', to: '/news' },
  { label: 'งาน', icon: '/menuicon/box.svg', key: 'jobs', to: '/jobs' },
  { label: 'แดชบอร์ด', icon: '/menuicon/dashbord.svg', key: 'dashboard', to: '/' },
  { label: 'รายงาน', icon: '/menuicon/report.svg', key: 'reports', to: '/reports' },
  { label: 'สัญญา', icon: '/menuicon/contract.svg', key: 'contracts', to: '/contract/list' },
  { label: 'ลูกค้า', icon: '/menuicon/customer.svg', key: 'customers', to: '/customer/list' },
  { label: 'หลักทรัพย์', icon: '/menuicon/box.svg', key: 'assets', to: '/assets' },
  {
    label: 'เอกสารและการเงิน',
    icon: '/menuicon/document.svg',
    key: 'finance',
    children: [
      { label: 'ใบแจ้งหนี้', to: '/finance/invoice/list' },
      { label: 'ใบเสร็จรับเงิน', to: '/finance/receipt/list' },
      { label: 'บันทึกค่าใช้จ่าย', to: '/finance/expense/list' }
    ]
  },
  {
    label: 'การจัดเก็บ',
    icon: '/menuicon/storage.svg',
    key: 'stock',
    children: [
      { label: 'รายการเอกสารหลักทรัพย์', to: '/stock/list' },
      { label: 'ย้ายเอกสาร', to: '/stock/list2' }
    ]
  }
]
const buttomMenuItems: IMenuItem[] = [
  { label: 'ตั่งค่า', icon: '/menuicon/setting.svg', key: 'setting', to: '/setting' }
]

</script>
