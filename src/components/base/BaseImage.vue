<template>
  <div v-if="loading">
    <Skeleton
      class="w-full h-48 rounded-md mb-2 last:mb-0" />
  </div>
  <Image
    v-else
    :preview="preview"
    :pt="theme"
    :pt-options="{ mergeProps: ptViewMerge }"
    unstyled
    v-bind="{
      ...attrs,
      src: computedSrc
    }"
    @click.prevent.stop>
    <template #image>
      <img
        :alt="attrs?.alt ? String(attrs?.alt) : computedSrc"
        :src="computedSrc"
        v-bind="safeAttrs"
        @error="onError()">
    </template>
  </Image>
</template>

<script setup lang="ts">
import { type Attrs, computed, nextTick, ref, useAttrs, watchEffect } from 'vue'
import useFileUrl from '@/composables/useFileUrl'
import { ptViewMerge } from '@/volt/utils'
import type { ImagePassThroughOptions } from 'primevue'
import Image from 'primevue/image'

const FALLBACK_IMAGE = '/assets/images/logo-no-color.png'

interface IProps {
  filePath?: string | null
  preview?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  filePath: null,
  preview: true
})

const attrs = useAttrs()
const fallback = ref<boolean>(false)
const loading = ref<boolean>(false)


const filePathRef = computed((): string | null | undefined =>
  props.filePath && !isDirectUrl(props.filePath) ? props.filePath : undefined
)
const { url: signedUrl } = useFileUrl(filePathRef)

const computedSrc = ref<string>((attrs.src as string | undefined) || FALLBACK_IMAGE)

watchEffect((): void => {
  try {
    if (fallback.value) {
      computedSrc.value = FALLBACK_IMAGE
      return
    }
    if (props.filePath) {
      if (isDirectUrl(props.filePath)) {
        computedSrc.value = props.filePath
        return
      }
      computedSrc.value = signedUrl.value ?? FALLBACK_IMAGE
      return
    }
  } finally {
    loading.value = false
  }
})

const safeAttrs = computed((): Attrs => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { src, ...rest } = attrs
  return rest
})

function onError (): void {
  fallback.value = true
  nextTick()
}

function isDirectUrl (path: string): boolean {
  return path.startsWith('blob:') || path.startsWith('http://')
}

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
