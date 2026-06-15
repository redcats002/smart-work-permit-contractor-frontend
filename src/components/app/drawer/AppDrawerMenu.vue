<template>
  <!-- Expandable sub-menu -->
  <div v-if="hasChildren">
    <div
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2 cursor-pointer select-none',
        isAnyChildActive && 'bg-(--p-red)! text-white!'
      ]"
      @click="toggle()">
      <Icon
        v-if="notify"
        :class="isAnyChildActive ? 'text-white' : 'text-primary'"
        class="animate-pulse"
        icon="mdi:circle-medium" />
      <img
        v-if="isImageIcon"
        :class="isAnyChildActive && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <Icon
        v-else
        :class="['size-5', isAnyChildActive ? 'text-white' : 'text-surface-700']"
        :icon="icon" />
      <span class="grow">{{ label }}</span>
      <Icon
        :class="isAnyChildActive ? 'text-white' : 'text-surface-400'"
        :icon="isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="text-base" />
    </div>

    <div
      v-if="isExpanded"
      class="mt-0.5 space-y-0.5">
      <router-link
        v-for="child in children"
        :key="child.label"
        v-slot="{ isActive, isExactActive, navigate, href }"
        :to="child.to"
        custom>
        <a
          :class="[
            'pl-9 pr-2 py-1.5 rounded text-sm duration-200 hover:bg-(--p-gray-5) cursor-pointer block',
            (isActive || isExactActive || isInBackChain(child.to)) && !disabled && !child?.disabled ? 'text-(--p-red) font-semibold' : 'text-surface-700',
            (disabled || child?.disabled) && 'cursor-not-allowed opacity-50 pointer-events-none'
          ]"
          :href="href"
          @click="!disabled && navigate($event)">
          {{ child.label }}
        </a>
      </router-link>
    </div>
  </div>

  <!-- Simple menu item -->
  <router-link
    v-else
    v-slot="{ isActive, isExactActive, navigate, href }"
    :to="to!"
    custom>
    <a
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2 cursor-pointer',
        (isActive || isExactActive || isRootActive) && !disabled && 'bg-(--p-red)! text-white!',
        disabled && 'cursor-not-allowed opacity-50 pointer-events-none'
      ]"
      :href="href"
      @click="!disabled && navigate($event)">
      <Icon
        v-if="notify"
        :class="(isActive || isExactActive || isRootActive) ? 'text-white' : 'text-primary'"
        class="animate-pulse"
        icon="mdi:circle-medium" />
      <img
        v-if="isImageIcon"
        :class="(isActive || isExactActive || isRootActive) && !disabled && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <Icon
        v-else
        :class="['size-5', (isActive || isExactActive || isRootActive) && !disabled ? 'text-white' : 'text-surface-700']"
        :icon="icon" />
      <span class="grow">{{ label }}</span>
    </a>
  </router-link>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBackChain } from '@/composables/useBackChain'

export interface ISubMenuItem {
  label: string
  to: RouteLocationRaw
  disabled?: boolean
}

interface IProps {
  label: string
  icon: string
  notify?: boolean
  to?: RouteLocationRaw
  disabled?: boolean
  children?: ISubMenuItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  notify: false,
  to: undefined,
  children: undefined
})

const route = useRoute()
const { isInBackChain } = useBackChain()

const hasChildren = computed((): boolean => !!props.children?.length)
const isImageIcon = computed((): boolean => props.icon.startsWith('/'))

// Simple item active state
const isRootActive = computed((): boolean => props.to ? isInBackChain(props.to) : false)

// Sub-menu active state
const isAnyChildActive = computed((): boolean => {
  if (!props.children?.length) return false
  return props.children.some((child: ISubMenuItem): boolean => {
    if (typeof child.to === 'string') return route.path.startsWith(child.to)
    if (typeof child.to === 'object' && 'path' in child.to) return route.path.startsWith(child.to.path as string)
    return false
  }) || props.children.some((child: ISubMenuItem): boolean => isInBackChain(child.to))
})

const isExpanded = ref<boolean>(isAnyChildActive.value)

watch(isAnyChildActive, (val: boolean): void => {
  if (val) isExpanded.value = true
})

function toggle (): void {
  isExpanded.value = !isExpanded.value
}
</script>
