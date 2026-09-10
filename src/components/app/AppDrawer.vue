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
        :key="item.key">
        <!--
          isRegistered() gates real navigation until a route exists and falls back to an inert row
          with identical styling in the meantime — see the "Router" section of AGENTS.md. Every
          route this drawer links to is registered today, so this never actually falls through;
          it is kept because the check costs nothing and the failure mode it guards (a thrown
          navigation on vue-router 5) is not one to reintroduce by deleting it "because it's dead".
        -->
        <RouterLink
          v-if="item.kind === 'link' && isRegistered(item.name)"
          :class="isActive(item.matchPrefix)
            ? 'border-(--color-primary-500) bg-(--color-shell-sidebar-active) pl-[15px] text-white'
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
          v-else-if="item.kind === 'link'"
          class="flex cursor-default items-center gap-[11px] border-l-[3px] border-transparent py-[11px] pl-[18px]
            pr-[18px] text-[13.5px] font-medium text-(--color-shell-sidebar-fg)">
          <span
            aria-hidden="true"
            class="text-[15px]">{{ item.glyph }}</span>
          {{ t(item.labelKey) }}
        </span>

        <!-- wayfinder 110 — "Personnel" is a non-navigable group header (no route of its own,
             nobody asked for one); its children render exactly like a top-level link, just
             indented, and carry the same isRegistered()/isActive() rules. -->
        <template v-else>
          <div
            :class="isGroupActive(item) ? 'text-white' : 'text-(--color-shell-sidebar-fg)'"
            class="flex items-center gap-[11px] py-[11px] pl-[18px] pr-[18px] text-[13.5px] font-semibold">
            <span
              aria-hidden="true"
              class="text-[15px]">{{ item.glyph }}</span>
            {{ t(item.labelKey) }}
          </div>
          <template
            v-for="child in item.children"
            :key="child.name">
            <RouterLink
              v-if="isRegistered(child.name)"
              :class="isActive(child.matchPrefix)
                ? 'border-(--color-primary-500) bg-(--color-shell-sidebar-active) pl-[33px] text-white'
                : 'border-transparent pl-[36px] text-(--color-shell-sidebar-fg) hover:bg-(--color-shell-sidebar-hover)'"
              :to="{ name: child.name }"
              class="flex items-center gap-[11px] border-l-[3px] py-[9px] pr-[18px] text-[13px] font-medium
                transition-colors">
              {{ t(child.labelKey) }}
            </RouterLink>
            <span
              v-else
              class="flex cursor-default items-center gap-[11px] border-l-[3px] border-transparent py-[9px] pl-[36px]
                pr-[18px] text-[13px] font-medium text-(--color-shell-sidebar-fg)">
              {{ t(child.labelKey) }}
            </span>
          </template>
        </template>
      </template>
    </nav>

    <div class="mt-auto border-t border-(--color-shell-sidebar-divider) px-[18px] py-[14px]">
      <div class="flex items-center gap-[9px]">
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--color-shell-avatar)
            text-[13px] font-semibold text-white">
          {{ initials }}
        </div>
        <!-- The account card is the only route into the profile: this app has no header menu.
             A button rather than a RouterLink so it inherits the drawer's own close behaviour
             on mobile, the same way the nav items do. -->
        <button
          class="min-w-0 flex-1 cursor-pointer text-left leading-[1.2]"
          type="button"
          @click="goToProfile()">
          <div class="truncate text-[12px] font-medium text-white">
            {{ displayName }}
          </div>
          <div class="truncate text-[10px] text-(--color-shell-sidebar-muted)">
            {{ t('platform.accountType') }}
          </div>
        </button>
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
import Icon from '@/components/base/AppIcon.vue'

interface IChildNavItem {
  name: string
  labelKey: string
  matchPrefix: string
}

interface ILinkNavItem {
  kind: 'link'
  key: string
  name: string
  labelKey: string
  glyph: string
  matchPrefix: string
}

interface IGroupNavItem {
  kind: 'group'
  key: string
  labelKey: string
  glyph: string
  children: IChildNavItem[]
}

type INavItem = ILinkNavItem | IGroupNavItem

/**
 * wayfinder 110 — the contractor menu shrinks: "Create permit" is cut (`PermitListPage` already
 * has its own create button) and "History" is cut (folded into `PermitListPage` as a view mode).
 * "Getting started" moves to the app bar (`AppTopbar.vue`). "Personnel" is a new group holding the
 * two former top-level items Certificates and Workers.
 */
const navItems: INavItem[] = [
  {
    kind: 'link', key: 'permits', name: 'PermitListPage', labelKey: 'platform.nav.permits', glyph: '▦', matchPrefix: '/permits'
  },
  {
    kind: 'group',
    key: 'personnel',
    labelKey: 'platform.nav.personnel',
    glyph: '👥',
    children: [
      { name: 'CertificateListPage', labelKey: 'platform.nav.certificates', matchPrefix: '/certificates' },
      { name: 'WorkerListPage', labelKey: 'platform.nav.workers', matchPrefix: '/workers' }
    ]
  }
]

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isOpen, close } = useAppDrawer()
const { logout } = useLogout()

function isActive (matchPrefix: string): boolean {
  return route.path.startsWith(matchPrefix)
}

function isGroupActive (item: IGroupNavItem): boolean {
  return item.children.some((child: IChildNavItem): boolean => isActive(child.matchPrefix))
}

function isRegistered (name: string): boolean {
  return router.hasRoute(name)
}

function goToProfile (): void {
  close()
  void router.push({ name: 'ProfileDetailPage' })
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
