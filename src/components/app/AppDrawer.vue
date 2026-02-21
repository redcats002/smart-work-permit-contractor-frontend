<template>
  <aside class="w-64 h-screen bg-white border-r border-r-(--p-gray-5) flex flex-col p-4">
    <!-- Logo Section -->
    <div class="border-b border-b-(--p-red)">
      <div class="flex justify-center mb-2">
        <img
          class="h-12"
          src="/logo.svg">
      </div>
      <p class="text-sm text-(--p-red) flex justify-center my-2">
        สาขา : <span>ขอนแก่น</span>
      </p>
    </div>
    <Divider />

    <nav class="flex-1 space-y-1 overflow-y-auto">
      <AppDrawerMenu
        v-for="menu in menuItems"
        :key="`menu-${menu.label}`"
        :icon="menu.icon"
        :label="menu.label"
        :to="menu.to" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import AppDrawerMenu from './AppDrawerMenu.vue'

const menuItems = [
  { label: 'ข่าวสาร', icon: 'pi pi-file', key: 'news', to: '/news' },
  { label: 'งาน', icon: 'pi pi-box', key: 'jobs', to: '/jobs' },
  { label: 'แดชบอร์ด', icon: 'pi pi-th-large', key: 'dashboard', to: '/' },
  { label: 'รายงาน', icon: 'pi pi-bars', key: 'reports', to: '/reports' },
  { label: 'สัญญา', icon: 'pi pi-file-edit', key: 'contracts', to: '/contracts' },
  { label: 'ลูกค้า', icon: 'pi pi-user', key: 'customers', to: '/customer/list' },
  { label: 'หลักทรัพย์', icon: 'pi pi-box', key: 'assets', to: '/assets' },
  { label: 'เอกสารและการเงิน', icon: 'pi pi-file', key: 'finance', to: '/finance' },
  { label: 'การจัดเก็บ', icon: 'pi pi-inbox', key: 'storage', to: '/storage' }
]
</script>
