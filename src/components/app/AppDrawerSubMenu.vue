<template>
  <div>
    <!-- Parent row -->
    <div
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2 cursor-pointer select-none',
        isAnyChildActive && 'bg-(--p-red)! text-white!'
      ]"
      @click="toggle()">
      <img
        :class="isAnyChildActive && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <span class="grow">{{ label }}</span>
      <Icon
        :class="isAnyChildActive ? 'text-white' : 'text-surface-400'"
        :icon="isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="text-base" />
    </div>

    <!-- Child items -->
    <div
      v-if="isExpanded"
      class="mt-0.5 space-y-0.5">
      <RouterLink
        v-for="child in children"
        :key="child.label"
        v-slot="{ isActive }"
        :disabled="disabled"
        :to="child.to">
        <div
          :class="[
            'pl-9 pr-2 py-1.5 rounded text-sm duration-200 hover:bg-(--p-gray-5) cursor-pointer',
            isActive ? 'text-(--p-red) font-semibold' : 'text-surface-700'
          ]">
          {{ child.label }}
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

interface ISubMenuItem {
  label: string
  to: RouteLocationRaw
}

interface IProps {
  label: string
  icon: string
  children: ISubMenuItem[]
  disabled?: boolean
}

const props = defineProps<IProps>()

const route = useRoute()

const isAnyChildActive = computed((): boolean => {
  return props.children.some((child: ISubMenuItem): boolean => {
    if (typeof child.to === 'string') return route.path.startsWith(child.to)
    if (typeof child.to === 'object' && 'path' in child.to) return route.path.startsWith(child.to.path as string)
    return false
  })
})

const isExpanded = ref<boolean>(isAnyChildActive.value)

watch(isAnyChildActive, (val: boolean): void => {
  if (val) isExpanded.value = true
})

function toggle (): void {
  isExpanded.value = !isExpanded.value
}
</script>
