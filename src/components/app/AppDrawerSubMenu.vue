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
        v-if="isImageIcon"
        :class="isAnyChildActive && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <Icon
        v-else
        :class="[
          'size-5',
          isAnyChildActive ? 'text-white' : 'text-surface-700'
        ]"
        :icon="icon" />
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
      <router-link
        v-for="child in children"
        :key="child.label"
        v-slot="{ isActive, isExactActive, navigate, href }"
        :disabled="disabled || child?.disabled"
        :to="child.to"
        custom>
        <a
          :class="[
            'pl-9 pr-2 py-1.5 rounded text-sm duration-200 hover:bg-(--p-gray-5) cursor-pointer block',
            (isActive || isExactActive || isChildActiveByBack(child.to)) && !disabled && !child?.disabled ? 'text-(--p-red) font-semibold' : 'text-surface-700',
            (disabled || child?.disabled) && 'cursor-not-allowed opacity-50 pointer-events-none'
          ]"
          :href="href"
          @click="!disabled && navigate($event)">
          {{ child.label }}
        </a>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

export interface ISubMenuItem {
  label: string
  to: RouteLocationRaw
  disabled?: boolean
}

interface IProps {
  label: string
  icon: string
  children: ISubMenuItem[]
  disabled?: boolean
}

const props = defineProps<IProps>()

const route = useRoute()
const router = useRouter()

const backListPath = computed((): string | null => {
  const backMeta = route.meta.back as { name?: string } | undefined
  if (!backMeta?.name) return null
  return router.resolve({ name: backMeta.name }).path
})

const isAnyChildActive = computed((): boolean => {
  return props.children.some((child: ISubMenuItem): boolean => {
    if (typeof child.to === 'string') return route.path.startsWith(child.to)
    if (typeof child.to === 'object' && 'path' in child.to) return route.path.startsWith(child.to.path as string)
    return false
  }) || (backListPath.value !== null && props.children.some((child: ISubMenuItem): boolean => {
    return router.resolve(child.to).path === backListPath.value
  }))
})

function isChildActiveByBack (childTo: RouteLocationRaw): boolean {
  if (backListPath.value === null) return false
  return router.resolve(childTo).path === backListPath.value
}

const isExpanded = ref<boolean>(isAnyChildActive.value)
const isImageIcon = computed((): boolean => props.icon.startsWith('/'))

watch(isAnyChildActive, (val: boolean): void => {
  if (val) isExpanded.value = true
})

function toggle (): void {
  isExpanded.value = !isExpanded.value
}
</script>
