<template>
  <!-- Sidebar
    Desktop : always visible, part of the normal flex flow (md:relative)
    Mobile  : fixed overlay that slides in from the left via translate-x
  -->
  <aside
    :class="isOpen ? 'translate-x-0 z-100' : '-translate-x-full md:translate-x-0'"
    class="fixed md:relative inset-y-0 left-0 z-10 w-64 h-screen bg-white border-r border-r-(--p-gray-5) flex flex-col p-4 transition-transform duration-300 ease-in-out">
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
          <AppDrawerMenu
            :children="menu.children"
            :disabled="menu.disabled"
            :icon="menu.icon"
            :label="menu.label"
            :notify="menu.notify"
            :to="menu.to" />
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
          :notify="menu.notify"
          :to="menu.to!" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification.ts'
import { type TPermissionAction, type TPermissionModule } from '@/utils/Permission'
import useLogout from '@/pages/auth/composables/useLogout'
import { useAppDrawer } from '@/composables/useAppDrawer'
import { usePermission } from '@/composables/usePermission'
import { routes } from '@/router'
import { Icon } from '@iconify/vue'
import AppDrawerMenu, { type ISubMenuItem } from './drawer/AppDrawerMenu.vue'

const { isOpen, close } = useAppDrawer()
const { hasPermission } = usePermission()
const notificationStore = useNotificationStore()

const { logout } = useLogout()

interface IMenuItem {
  label: string
  icon: string
  key: string
  to?: string
  notify?: boolean
  disabled?: boolean
  children?: ISubMenuItem[]
}

interface IRouteMeta {
  title?: string
  menuTitle?: string
  icon?: string
  menu?: boolean
  disabled?: boolean
  permission?: TPermissionModule
  permissionAction?: TPermissionAction
}

interface IMenuRouteItem {
  label: string
  to: string
  icon?: string
  disabled?: boolean
  permission?: TPermissionModule
}

const authStore = useAuthStore()

const menuItems = computed<IMenuItem[]>((): IMenuItem[] => {
  return routes.flatMap((route: RouteRecordRaw): IMenuItem[] => {
    if (route.path === '/setting' || route.path.startsWith('/:pathMatch')) {
      return []
    }

    const routeMeta = getRouteMeta(route)
    if (routeMeta.permission && !hasPermission(routeMeta.permission)) {
      return []
    }

    const fullPath = normalizePath('', route.path)

    // นับ children ต้นฉบับที่มี menu: true (ก่อนกรอง permission)
    const originalChildCount = (route.children ?? []).filter((child: RouteRecordRaw): boolean => {
      const childMeta = getRouteMeta(child)
      return !!childMeta.menu
    }).length

    const childMenuItems = (route.children ?? []).flatMap((child: RouteRecordRaw): IMenuRouteItem[] => {
      const childPath = normalizePath(fullPath, child.path)
      return collectMenuRouteItems(child, childPath)
    })

    if (childMenuItems.length === 0) {
      return []
    }

    const icon = routeMeta.icon ?? childMenuItems[0]?.icon ?? ''
    const key = String(route.name ?? route.path)

    // ถ้าต้นฉบับมีแค่ 1 → simple item, ถ้าต้นฉบับมีมากกว่า 1 → dropdown (แม้จะเหลือ 1)
    if (originalChildCount <= 1) {
      return [
        {
          label: (routeMeta?.menuTitle || routeMeta?.title) ?? childMenuItems[0].label,
          icon,
          key,
          notify: getNotifyFlag(route),
          to: childMenuItems[0].to
        }
      ]
    }

    return [
      {
        label: (routeMeta?.menuTitle || routeMeta?.title) ?? childMenuItems[0].label,
        icon,
        key,
        notify: getNotifyFlag(route),
        children: childMenuItems.map((item: IMenuRouteItem): ISubMenuItem => ({
          label: item.label,
          to: item.to,
          disabled: item?.disabled
        }))
      }
    ]
  })
})

function getNotifyFlag (route: RouteRecordRaw): boolean {
  if (route.name === 'WorkPage') return notificationStore.isNewWork
  if (route.name === 'AnnouncementPage') return notificationStore.isNewAnnouncement
  return false
}

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

  // Skip if no permission for this specific route/child
  if (meta.permission) {
    if (meta.permissionAction) {
      if (!hasPermission(meta.permission, meta.permissionAction)) {
        return []
      }
    } else if (!hasPermission(meta.permission)) {
      return []
    }
  }

  const currentItems
    = meta.menu && (meta?.menuTitle || meta?.title)
      ? [
        {
          label: (meta?.menuTitle || meta?.title || ''),
          to: fullPath,
          icon: meta.icon,
          disabled: meta.disabled,
          permission: meta.permission
        }
      ]
      : []

  const childItems = (route.children ?? []).flatMap((child: RouteRecordRaw): IMenuRouteItem[] => {
    const childPath = normalizePath(fullPath, child.path)
    return collectMenuRouteItems(child, childPath)
  })

  return [...currentItems, ...childItems]
}

const bottomMenuItems = computed<IMenuItem[]>((): IMenuItem[] => {
  if (!hasPermission('settings')) {
    return []
  }

  return [{ label: 'ตั้งค่า', icon: 'lsicon:setting-outline', key: 'setting', to: '/setting' }]
})
</script>
