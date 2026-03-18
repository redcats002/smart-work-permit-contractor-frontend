<template>
  <section
    id="setting-list-page">
    <PageTitle />
    <BasePage>
      <BaseContainer>
        <div
          v-for="(item, i) in items"
          :key="`setting-${i}`">
          <div class="flex items-center gap-2 mb-2">
            <Icon
              v-if="item?.icon"
              :icon="item.icon"
              color="#BD0102"
              width="30" />
            <span class="font-bold">{{ item.name }}</span>
          </div>
          <template v-if="item?.children?.length">
            <div class="flex flex-col gap-2 ml-10">
              <router-link
                v-for="(child, j) in item?.children"
                :key="`setting-child-${j}`"
                :to="child.to"
                class="hover:text-primary transition-all">
                {{ child.name }}
              </router-link>
            </div>
          </template>
          <Divider />
        </div>
      </BaseContainer>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { routes } from '@/router/index'
import { Icon } from '@iconify/vue'

interface ISettingItem {
  name: string
  to: RouteRecordRaw
  icon?: string
  children?: ISettingItem[]
}
const items = ref<ISettingItem[]>(createSettingList())
/**
 * Recursively walks the route tree and returns a flat list of
 * setting-group items (routes flagged with `meta.setting: true`).
 *
 * - Parent routes with `meta.setting` become group headers with optional children.
 * - Child routes without the flag are still collected under their parent if the
 *   parent has the flag.
 * - Routes without the flag are traversed but not included themselves.
 */
function buildSettingItems (routeList: RouteRecordRaw[], parentPath: string = ''): ISettingItem[] {
  const result: ISettingItem[] = []

  for (const route of routeList) {
    // Compute the absolute path: if the route path starts with `/` it is
    // already absolute; otherwise compose it with the parent path.
    const fullPath: string = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')

    if (route.meta?.setting) {
      // Map child routes to nested ISettingItems (children don't need the flag)
      const children: ISettingItem[] | undefined = route.children?.length
        ? route.children.map((child: RouteRecordRaw): ISettingItem => {
          // const childPath: string = child.path.startsWith('/')
          //   ? child.path
          //   : `${fullPath}/${child.path}`.replace(/\/+/g, '/')
          return {
            name: String(child.meta?.title ?? child.name ?? ''),
            to: child,
            icon: child.meta?.icon as string | undefined
          }
        })
        : undefined

      result.push({
        name: String(route.meta.title ?? route.name ?? ''),
        to: route,
        icon: route.meta.icon as string | undefined,
        children: children?.length ? children : undefined
      })
    } else if (route.children?.length) {
      // Route itself is not a setting item – keep traversing its children
      result.push(...buildSettingItems(route.children, fullPath))
    }
  }

  return result
}

function createSettingList (): ISettingItem[] {
  return buildSettingItems(routes)
}


</script>

<style scoped>

</style>
