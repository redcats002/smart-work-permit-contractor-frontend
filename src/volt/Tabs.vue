<template>
  <Tabs
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
  </Tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tabs, {
  type TabsPassThroughOptions,
  type TabsProps
} from 'primevue/tabs'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabsProps {}
defineProps<Props>()

// Deliberately unopinionated: the root only stacks the strip above the panels. Spacing between
// the strip and the panel body belongs to the caller — wayfinder 113 is the first caller, and it
// composes this directly on PermitDetailPage.vue.
const theme = ref<TabsPassThroughOptions>({
  root: 'flex flex-col'
})
</script>
