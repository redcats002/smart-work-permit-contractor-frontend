<template>
  <router-link
    v-slot="{ isActive, isExactActive, navigate, href }"
    :to="to"
    custom>
    <a
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2 cursor-pointer',
        (isActive || isExactActive || isRootActive) && !disabled && 'bg-(--p-red)! text-white!',
        disabled && 'cursor-not-allowed opacity-50 pointer-events-none'
      ]"
      :href="href"
      @click="!disabled && navigate($event)">
      <img
        v-if="isImageIcon"
        :class="(isActive || isExactActive || isRootActive) && !disabled && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <Icon
        v-else
        :class="[
          'size-5',
          (isActive || isExactActive || isRootActive) && !disabled ? 'text-white' : 'text-surface-700'
        ]"
        :icon="icon" />
      <span class="grow">
        {{ label }}
      </span>
    </a>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

interface IProps {
  label: string
  icon: string
  activeIcon?: string
  to: RouteLocationRaw
  disabled?: boolean
}

const props = defineProps<IProps>()

const route = useRoute()
const router = useRouter()

const isImageIcon = computed((): boolean => props.icon.startsWith('/'))

const isRootActive = computed((): boolean => {
  const backMeta = route.meta.back as { name?: string } | undefined
  if (!backMeta?.name) return false
  const backPath = router.resolve({ name: backMeta.name }).path
  const toPath = router.resolve(props.to).path
  return backPath === toPath
})
</script>
