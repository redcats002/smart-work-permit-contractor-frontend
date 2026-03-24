<template>
  <nav aria-label="breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <template
        v-for="(item, index) in items"
        :key="index">
        <li class="flex items-center gap-2">
          <component
            :is="isActive(index) ? 'span' : 'router-link'"
            :class="[
              'text-2xl font-bold',
              isActive(index)
                ? 'text-font-gray cursor-default'
                : 'text-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer'
            ]"
            :to="!isActive(index) ? normalizeRoute(item.route) : undefined">
            {{ item.label }}
          </component>
          <Icon
            v-if="!isActive(index)"
            class="w-4 h-4 text-gray-400"
            icon="mdi:chevron-right" />
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

export interface BreadcrumbItem {
  label: string
  route?: string | RouteLocationRaw
  disabled?: boolean
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()

function isActive (index: number): boolean {
  return index === props.items.length - 1
}

function normalizeRoute (route?: string | RouteLocationRaw): RouteLocationRaw | undefined {
  if (!route) return undefined
  if (typeof route === 'string') return { name: route }
  return route
}
</script>
