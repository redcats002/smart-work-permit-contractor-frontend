<template>
  <TabPanel
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
  </TabPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabPanel, {
  type TabPanelPassThroughOptions,
  type TabPanelProps
} from 'primevue/tabpanel'
import { ptViewMerge } from './utils'

// `value` is the one prop PrimeVue requires and it is forwarded explicitly — the rest of
// TabPanelProps still arrives as fallthrough attributes, the same as every other wrapper here.
interface Props extends /* @vue-ignore */ TabPanelProps {
  value: string | number
}
defineProps<Props>()

// Worth knowing before composing with this: unless the parent Tabs sets `lazy`, every panel is
// mounted and the inactive ones are hidden with `v-show`. Wayfinder 113 relies on this — switching
// tabs on PermitDetailPage.vue must not re-fetch or re-mount a section, and the dead
// `src/components/base/BaseTabWindow.vue` would have (it mounts only the active tab's component).
// Verified empirically before choosing this over BaseTabWindow: the existing, UNMODIFIED
// `PermitDetailPage.test.ts` suite — including its zero-interaction assertions on the LAST
// section (audit trail) — passes once every section sits inside one of these panels.
const theme = ref<TabPanelPassThroughOptions>({
  root: 'bg-transparent focus:outline-none'
})
</script>
