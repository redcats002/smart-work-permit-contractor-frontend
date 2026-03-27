<template>
  <Galleria
    v-model:active-index="activeIndex"
    :pt="theme"
    :pt-options="{ mergeProps: ptViewMerge }"
    :responsive-options="responsiveOptions"
    :value="images"
    container-style="width:100%; background-color: #E0E0E0; padding: 1.05rem;"
    circular
    unstyled
    @update:active-index="console.log($event)">
    <template #item="slotProps">
      <img
        :alt="slotProps.item.name"
        :src="slotProps.item.url"
        class="w-full h-96 max-h-96 object-contain bg-white p-2">
    </template>
    <template #thumbnail="slotProps">
      <div class="bg-white grid place-content-center">
        <img
          :alt="slotProps.item.name"
          :src="slotProps.item.url"
          class="aspect-square h-16 object-contain cursor-pointer">
      </div>
    </template>
    <template #previousthumbnailicon>
      <div @click="prev()">
        <Icon icon="mdi-chevron-left" />
      </div>
    </template>
    <template #nextthumbnailicon>
      <div @click="next()">
        <Icon icon="mdi-chevron-right" />
      </div>
    </template>
  </Galleria>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMedia } from '@/resources/provider/Upload.provider'
import { ptViewMerge } from '@/volt/utils'
import { Icon } from '@iconify/vue'
import type { GalleriaPassThroughOptions, GalleriaResponsiveOptions } from 'primevue'
import Galleria from 'primevue/galleria'

interface IProps {
  images?: IMedia[]
}

const props = withDefaults(defineProps<IProps>(), {
  images: (): IMedia[] => []
})

const activeIndex = ref<number>(0)
const responsiveOptions = ref<GalleriaResponsiveOptions[]>([
  { breakpoint: '1080px', numVisible: 2 },
  { breakpoint: '768px', numVisible: 1 }
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
  thumbnails: 'flex flex-col justify-center items-center',
  thumbnailContent: 'relative flex items-center w-fit',
  thumbnailPrevButton: `flex items-center justify-center cursor-pointer size-6 rounded-lg
    bg-white hover:bg-white/50 text-black transition-colors border border-black`,
  thumbnailPrevIcon: 'size-4',
  thumbnailNextButton: `flex items-center justify-center cursor-pointer size-6 rounded-lg
    bg-white hover:bg-white/50 text-black transition-colors border border-black`,
  thumbnailNextIcon: 'size-4',
  thumbnailsViewport: 'overflow-hidden flex-1 mx-2',
  thumbnailItems: `w-full
  flex items-center p-2
  transition-transform duration-300 ease-out`,
  thumbnailItem: `cursor-pointer opacity-60 hover:opacity-100
  transition-all
  data-[p-active=true]:z-2
  data-[p-active=true]:opacity-100
  data-[p-active=true]:ring-3
  data-[p-active=true]:ring-primary
  data-[p-active=true]:ring-offset-2
  data-[p-active=true]:ring-offset-white`,
  indicatorList: 'flex items-center justify-center gap-2 py-2',
  indicator: '',
  indicatorButton: `size-2.5 rounded-full bg-surface-300 transition-colors
    data-[p-active=true]:bg-primary`,
  mask: 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center',
  closeButton: `absolute top-3 right-3 flex items-center justify-center
    size-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors`,
  closeIcon: 'size-5'
})

function next (): void {
  if (props.images.length > 3) return
  activeIndex.value = activeIndex.value === props.images?.length - 1 ? 0 : activeIndex.value + 1
};
function prev (): void {
  if (props.images.length > 3) return
  activeIndex.value = activeIndex.value === 0 ? props.images?.length - 1 : activeIndex.value - 1
};
</script>
