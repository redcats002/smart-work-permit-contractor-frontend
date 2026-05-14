<template>
  <!-- Sidebar
    Desktop : always visible, part of the normal flex flow (md:relative)
    Mobile  : fixed overlay that slides in from the left via translate-x
  -->
  <aside
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    class="fixed md:relative inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-r-(--p-gray-5) flex flex-col p-4 transition-transform duration-300 ease-in-out">
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
        สาขา :
        <span>{{ authStore.branch?.name || 'BY_PASS' }}</span>
        <Icon
          class="text-font-gray cursor-pointer hover:text-black transition-all duration-200"
          icon="iconamoon:exit"
          @click="logout()" />
      </p>
    </div>

    <nav
      class="mt-4 flex flex-col flex-1 overflow-y-auto"
      @click="close()">
      <!-- Top Menu -->
      <div class="space-y-1">
        <template
          v-for="menu in menuItems"
          :key="`top-${menu.label}`">
          <AppDrawerSubMenu
            v-if="menu.children?.length"
            :children="menu.children"
            :disabled="menu.disabled"
            :icon="menu.icon"
            :label="menu.label" />
          <AppDrawerMenu
            v-else
            :disabled="menu.disabled"
            :icon="menu.icon"
            :label="menu.label"
            :to="menu.to!" />
        </template>
      </div>

      <!-- Bottom Menu -->
      <div class="space-y-1 mt-auto">
        <AppDrawerMenu
          v-for="menu in bottomMenuItems"
          :key="`bottom-${menu.label}`"
          :disabled="menu.disabled"
          :icon="menu.icon"
          :label="menu.label"
          :to="menu.to!" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import useLogout from '@/pages/auth/composables/useLogout'
import { useAppDrawer } from '@/composables/useAppDrawer'
import { routes } from '@/router'
import { Icon } from '@iconify/vue'
import AppDrawerMenu from './AppDrawerMenu.vue'
import AppDrawerSubMenu, { type ISubMenuItem } from './AppDrawerSubMenu.vue'

const { isOpen, close } = useAppDrawer()

const { logout } = useLogout()

interface IMenuItem {
  label: string
  icon: string
  key: string
  to?: string
  disabled?: boolean
  children?: ISubMenuItem[]
}

interface IRouteMeta {
  title?: string
  menuTitle?: string
  icon?: string
  menu?: boolean
  disabled?: boolean
}

interface IMenuRouteItem {
  label: string
  to: string
  icon?: string
  disabled?: boolean
}

const authStore = useAuthStore()

const menuItems = computed<IMenuItem[]>((): IMenuItem[] => {
  return routes.flatMap((route: RouteRecordRaw): IMenuItem[] => {
    if (route.path === '/setting' || route.path.startsWith('/:pathMatch')) {
      return []
    }

    const fullPath = normalizePath('', route.path)
    const routeMeta = getRouteMeta(route)
    const childMenuItems = (route.children ?? []).flatMap((child: RouteRecordRaw): IMenuRouteItem[] => {
      const childPath = normalizePath(fullPath, child.path)
      return collectMenuRouteItems(child, childPath)
    })

    if (childMenuItems.length === 0) {
      return []
    }

    const icon = routeMeta.icon ?? childMenuItems[0]?.icon ?? ''
    const key = String(route.name ?? route.path)

    if (childMenuItems.length === 1) {
      return [
        {
          label: (routeMeta?.menuTitle || routeMeta?.title) ?? childMenuItems[0].label,
          icon,
          key,
          to: childMenuItems[0].to
        }
      ]
    }

    return [
      {
        label: (routeMeta?.menuTitle || routeMeta?.title) ?? childMenuItems[0].label,
        icon,
        key,
        children: childMenuItems.map((item: IMenuRouteItem): ISubMenuItem => ({
          label: item.label,
          to: item.to,
          disabled: item?.disabled
        }))
      }
    ]
  })
})

function normalizePath (parentPath: string, path: string): string {
  if (path.startsWith('/')) {
    return path
  }

  if (parentPath === '' || parentPath === '/') {
    return `/${path}`.replace(/\/+/g, '/')
  }

  return `${parentPath.replace(/\/$/, '')}/${path}`.replace(/\/+/g, '/')
}

function getRouteMeta (route: RouteRecordRaw): IRouteMeta {
  return (route.meta ?? {}) as IRouteMeta
}

function collectMenuRouteItems (route: RouteRecordRaw, fullPath: string): IMenuRouteItem[] {
  const meta = getRouteMeta(route)
  const currentItems
    = meta.menu && (meta?.menuTitle || meta?.title)
      ? [
        {
          label: (meta?.menuTitle || meta?.title || ''),
          to: fullPath,
          icon: meta.icon,
          disabled: meta.disabled
        }
      ]
      : []

  const childItems = (route.children ?? []).flatMap((child: RouteRecordRaw): IMenuRouteItem[] => {
    const childPath = normalizePath(fullPath, child.path)
    return collectMenuRouteItems(child, childPath)
  })

  return [...currentItems, ...childItems]
}

const bottomMenuItems: IMenuItem[] = [{ label: 'ตั่งค่า', icon: 'lsicon:setting-outline', key: 'setting', to: '/setting' }]
</script>
