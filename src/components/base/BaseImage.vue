<template>
  <Image
    :pt="theme"
    :pt-options="{ mergeProps: ptViewMerge }"
    preview
    unstyled
    v-bind="attrs" />
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { ptViewMerge } from '@/volt/utils'
import type { ImagePassThroughOptions } from 'primevue'
import Image from 'primevue/image'

const attrs = useAttrs()

const theme = ref<ImagePassThroughOptions>({
  root: 'relative inline-flex',
  image: 'block max-w-full',
  previewMask: `absolute inset-0 flex items-center justify-center
    bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded`,
  previewIcon: 'size-8 text-white',
  mask: 'fixed inset-0 z-50 flex items-center justify-center bg-black/90',
  toolbar: 'absolute top-4 right-4 flex items-center gap-2',
  rotateRightButton: `flex items-center justify-center size-9 rounded-full
    bg-white/10 hover:bg-white/20 text-white transition-colors`,
  rotateRightIcon: 'size-5',
  rotateLeftButton: `flex items-center justify-center size-9 rounded-full
    bg-white/10 hover:bg-white/20 text-white transition-colors`,
  rotateLeftIcon: 'size-5',
  zoomOutButton: `flex items-center justify-center size-9 rounded-full
    bg-white/10 hover:bg-white/20 text-white transition-colors`,
  zoomOutIcon: 'size-5',
  zoomInButton: `flex items-center justify-center size-9 rounded-full
    bg-white/10 hover:bg-white/20 text-white transition-colors`,
  zoomInIcon: 'size-5',
  closeButton: `flex items-center justify-center size-9 rounded-full
    bg-white/10 hover:bg-white/20 text-white transition-colors`,
  closeIcon: 'size-5',
  originalContainer: 'flex items-center justify-center w-full h-full px-4',
  original: 'max-w-full max-h-screen object-contain'
})
</script>
