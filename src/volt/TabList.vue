<template>
  <TabList
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    unstyled>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps">
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}" />
    </template>
  </TabList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabList, {
  type TabListPassThroughOptions,
  type TabListProps
} from 'primevue/tablist'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabListProps {}
defineProps<Props>()

const theme = ref<TabListPassThroughOptions>({
  root: 'relative flex',
  // This app is desktop/tablet-first but must not break at 375px (AGENTS.md). A strip wider than
  // the viewport scrolls sideways INSIDE itself rather than widening the page — page-level
  // horizontal scroll is forbidden. `content` is also what PrimeVue's own prev/next navigators
  // scroll, so both act on the same box (navigators stay off below; see Tabs usage).
  content: 'grow overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [&::-webkit-scrollbar]:hidden',
  tabList: 'relative flex border-b border-border',
  prevButton: 'absolute start-0 top-0 z-20 flex h-full w-8 items-center justify-center bg-surface-card text-text-primary',
  nextButton: 'absolute end-0 top-0 z-20 flex h-full w-8 items-center justify-center bg-surface-card text-text-primary',
  // The active tab draws its own bottom border (see Tab.vue) — a JS-measured ink bar is one more
  // thing to be wrong in a scrolled strip on a 375px screen, so it is switched off rather than
  // stacked on top of the border.
  activeBar: 'hidden'
})
</script>
