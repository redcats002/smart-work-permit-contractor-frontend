<template>
  <BaseTopSticky>
    <Breadcrumb :items="breadcrumbItems" />
    <div>
      <slot />
    </div>
  </BaseTopSticky>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type RouteLocationNormalizedLoadedGeneric, useRoute } from 'vue-router'
import BaseTopSticky from '../base/BaseTopSticky.vue'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.vue'

interface IProps {
  items?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  items: (): BreadcrumbItem[] => []
})

const route = useRoute()
const titleRoute = computed<string>((): string => (route?.meta?.title as string || ''))

const breadcrumbItems = computed((): BreadcrumbItem[] => {
  if (props.items?.length) return props.items
  const items: BreadcrumbItem[] = []
  const breadcrumbItem: BreadcrumbItem[] = route.meta?.breadcrumb as BreadcrumbItem[] || []
  if (breadcrumbItem?.length) {
    breadcrumbItem.forEach((_item: BreadcrumbItem): void => {
      const item = _item
      const to = item.route as RouteLocationNormalizedLoadedGeneric

      if (to?.params) {
        Object.keys(to.params).forEach((key: string): void => {
          to.params[key] = route.params[key]
        })
      }

      items.push({
        ...item,
        route: to
      })
    })
  }
  items.push({
    label: titleRoute.value,
    route,
    disabled: true
  })
  return items
})
</script>

<style scoped>

</style>
