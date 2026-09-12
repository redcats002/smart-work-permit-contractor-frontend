<template>
  <Tab
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    :value="value"
    unstyled>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps">
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}" />
    </template>
  </Tab>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tab, {
  type TabPassThroughOptions,
  type TabProps
} from 'primevue/tab'
import { ptViewMerge } from './utils'

// `value` is the one prop PrimeVue requires and it is forwarded explicitly — the rest of
// TabProps still arrives as fallthrough attributes, the same as every other wrapper here.
interface Props extends /* @vue-ignore */ TabProps {
  value: string | number
}
defineProps<Props>()

// PrimeVue's Tab already supplies role="tab", aria-selected, roving tabindex and the
// Left/Right/Home/End key handling — the reason this is a PT wrapper over the real component and
// not a styled `<div @click>` like the dead `src/components/base/BaseTab.vue`. `min-h-11` is the
// 44px touch target AGENTS.md requires. The active tab is marked by weight + colour + its own
// bottom border, never by colour alone.
const theme = ref<TabPassThroughOptions>({
  root: `relative -mb-px flex shrink-0 cursor-pointer select-none items-center justify-center gap-2
        min-h-11 whitespace-nowrap border-b-2 border-transparent px-4 py-2.5
        bg-transparent text-[13px] font-semibold text-text-secondary transition-colors duration-200
        hover:text-text-primary
        focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary
        p-active:border-primary p-active:font-bold p-active:text-primary-emphasis
        p-disabled:cursor-default p-disabled:opacity-60`
})
</script>
