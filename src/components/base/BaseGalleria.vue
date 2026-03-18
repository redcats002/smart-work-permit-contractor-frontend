<template>
  <Galleria
    :pt="theme"
    :pt-options="{ mergeProps: ptViewMerge }"
    :responsive-options="responsiveOptions"
    :value="images"
    container-style="width:100%; background-color: #FAFAFE; padding: 0.5rem; border-radius: 0.5rem;"
    unstyled>
    <template #item="slotProps">
      <img
        :alt="slotProps.item.originalName"
        :src="slotProps.item.fileUrl"
        class="w-full h-96 max-h-96 object-contain rounded-lg">
    </template>
    <template #thumbnail="slotProps">
      <img
        :alt="slotProps.item.originalName"
        :src="slotProps.item.fileUrl"
        class="w-full h-16 object-cover rounded cursor-pointer">
    </template>
  </Galleria>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMedia } from '@/resources/provider/Upload.provider'
import { ptViewMerge } from '@/volt/utils'
import type { GalleriaPassThroughOptions, GalleriaResponsiveOptions } from 'primevue'
import Galleria from 'primevue/galleria'

interface IProps {
  images?: IMedia[]
}

withDefaults(defineProps<IProps>(), {
  images: (): IMedia[] => []
})

const responsiveOptions = ref<GalleriaResponsiveOptions[]>([
  { breakpoint: '1300px', numVisible: 4 },
  { breakpoint: '575px', numVisible: 1 }
])

const theme = ref<GalleriaPassThroughOptions>({
  root: 'flex flex-col gap-2',
  content: 'flex flex-col gap-2',
  itemsContainer: 'relative flex flex-col',
  items: 'relative overflow-hidden w-full',
  item: 'flex items-center justify-center w-full',
  prevButton: `absolute top-1/2 left-2 -translate-y-1/2 z-10 flex items-center justify-center
    size-9 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors`,
  prevIcon: 'size-5',
  nextButton: `absolute top-1/2 right-2 -translate-y-1/2 z-10 flex items-center justify-center
    size-9 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors`,
  nextIcon: 'size-5',
  caption: 'bg-black/50 text-white text-sm px-4 py-2',
  thumbnails: 'flex flex-col gap-2',
  thumbnailContent: 'relative flex items-center',
  thumbnailPrevButton: `flex items-center justify-center cursor-pointer size-6 rounded-lg
    bg-black/30 hover:bg-black/50 text-white transition-colors`,
  thumbnailPrevIcon: 'size-4',
  thumbnailNextButton: `flex items-center justify-center cursor-pointer size-6 rounded-lg
    bg-black/30 hover:bg-black/50 text-white transition-colors`,
  thumbnailNextIcon: 'size-4',
  thumbnailsViewport: 'overflow-hidden flex-1',
  thumbnailItems: 'flex px-2 gap-1',
  thumbnailItem: `cursor-pointer opacity-60 hover:opacity-100 transition-opacity
    data-[p-active=true]:opacity-100 data-[p-active=true]:ring-2 data-[p-active=true]:ring-primary rounded my-2`,
  indicatorList: 'flex items-center justify-center gap-2 py-2',
  indicator: '',
  indicatorButton: `size-2.5 rounded-full bg-surface-300 transition-colors
    data-[p-active=true]:bg-primary`,
  mask: 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center',
  closeButton: `absolute top-3 right-3 flex items-center justify-center
    size-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors`,
  closeIcon: 'size-5'
})
</script>
