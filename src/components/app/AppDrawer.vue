<template>
  <!-- Sidebar
    Desktop (>=900px) : always visible, part of the normal flex flow (min-[900px]:static)
    Mobile            : fixed full-height overlay that slides in from the left via translate-x
  -->
  <aside
    :class="isOpen ? 'translate-x-0' : '-translate-x-full min-[900px]:translate-x-0'"
    class="fixed inset-y-0 left-0 z-50 flex h-full w-[212px] shrink-0 flex-col overflow-y-auto
      bg-(--color-shell-sidebar) text-(--color-shell-sidebar-fg) transition-transform duration-300 ease-in-out
      min-[900px]:static min-[900px]:z-auto min-[900px]:translate-x-0">
    <!-- Mobile close button -->
    <div class="flex justify-end px-3 pt-3 min-[900px]:hidden">
      <button
        :aria-label="t('common.close')"
        class="flex size-8 items-center justify-center rounded text-(--color-shell-sidebar-fg)
          transition-colors hover:bg-(--color-shell-sidebar-hover)"
        type="button"
        @click="close()">
        <Icon
          class="size-5"
          icon="mdi:close" />
      </button>
    </div>

    <div
      class="px-[18px] pb-4 pt-1 text-[11px] font-semibold tracking-[0.5px] text-(--color-shell-sidebar-muted)
      min-[900px]:pt-[18px]">
      {{ t('platform.sidebarSection') }}
    </div>

    <nav
      class="flex flex-col"
      @click="close()">
      <template
        v-for="item in navItems"
        :key="item.name">
        <!--
          The four route names below are registered by other agents landing router modules
          in this same wave — resolving an unregistered name throws in vue-router 5 (not just
          a dev warning), so isRegistered() gates real navigation until the route exists and
          falls back to an inert row with identical styling in the meantime.
        -->
        <RouterLink
          v-if="isRegistered(item.name)"
          :class="isActive(item)
            ? 'border-(--color-accent-500) bg-(--color-shell-sidebar-active) pl-[15px] text-white'
            : 'border-transparent pl-[18px] text-(--color-shell-sidebar-fg) hover:bg-(--color-shell-sidebar-hover)'"
          :to="{ name: item.name }"
          class="flex items-center gap-[11px] border-l-[3px] py-[11px] pr-[18px] text-[13.5px] font-medium
            transition-colors">
          <span
            aria-hidden="true"
            class="text-[15px]">{{ item.glyph }}</span>
          {{ t(item.labelKey) }}
        </RouterLink>
        <span
          v-else
          class="flex cursor-default items-center gap-[11px] border-l-[3px] border-transparent py-[11px] pl-[18px]
            pr-[18px] text-[13.5px] font-medium text-(--color-shell-sidebar-fg)">
          <span
            aria-hidden="true"
            class="text-[15px]">{{ item.glyph }}</span>
          {{ t(item.labelKey) }}
        </span>
      </template>
    </nav>

    <div class="mt-auto border-t border-(--color-shell-sidebar-divider) px-[18px] py-[14px]">
      <div class="flex items-center gap-[9px]">
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--color-shell-avatar)
            text-[13px] font-semibold text-white">
          {{ initials }}
        </div>
        <div class="min-w-0 flex-1 leading-[1.2]">
          <div class="truncate text-[12px] font-medium text-white">
            {{ displayName }}
          </div>
          <div class="truncate text-[10px] text-(--color-shell-sidebar-muted)">
            {{ t('platform.accountType') }}
          </div>
        </div>
        <button
          :aria-label="t('platform.logout')"
          class="flex size-7 shrink-0 items-center justify-center rounded text-(--color-shell-sidebar-muted)
            transition-colors hover:bg-(--color-shell-sidebar-hover) hover:text-white"
          type="button"
          @click="logout()">
          <Icon
            class="size-4"
            icon="mdi:logout" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import { useAppDrawer } from '@/composables/useAppDrawer'
import useLogout from '@/pages/auth/composables/useLogout'
import { Icon } from '@iconify/vue'

interface INavItem {
  name: string
  labelKey: string
  glyph: string
  matchPrefix: string
}

const navItems: INavItem[] = [
  { name: 'PermitListPage', labelKey: 'platform.nav.permits', glyph: '▦', matchPrefix: '/permits' },
  { name: 'PermitCreatePage', labelKey: 'platform.nav.newPermit', glyph: '＋', matchPrefix: '/permits/create' },
  { name: 'HistoryListPage', labelKey: 'platform.nav.history', glyph: '◷', matchPrefix: '/history' },
  { name: 'CertificateListPage', labelKey: 'platform.nav.certificates', glyph: '◎', matchPrefix: '/certificates' }
]

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isOpen, close } = useAppDrawer()
const { logout } = useLogout()

// "My Permits" owns every /permits/* path except the create wizard, which has its own nav entry.
function isActive (item: INavItem): boolean {
  if (item.name === 'PermitListPage') {
    return route.path.startsWith('/permits') && !route.path.startsWith('/permits/create')
  }
  return route.path.startsWith(item.matchPrefix)
}

function isRegistered (name: string): boolean {
  return router.hasRoute(name)
}

const displayName = computed((): string => authStore.user.name || authStore.user.email || '—')

const initials = computed((): string => {
  const source = authStore.user.name || authStore.user.email
  if (!source) return '–'

  const parts = source.trim().split(/\s+/).filter(Boolean)
  const letters = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)
  return letters.toUpperCase()
})
</script>
