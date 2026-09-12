<template>
  <TabPanels
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
  </TabPanels>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabPanels, {
  type TabPanelsPassThroughOptions,
  type TabPanelsProps
} from 'primevue/tabpanels'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabPanelsProps {}
defineProps<Props>()

// No padding and no background of its own — a panel's body is the caller's layout, and
// PermitDetailPage.vue's sections already sit on their own cards (PermitDetailSection.vue).
const theme = ref<TabPanelsPassThroughOptions>({
  root: 'bg-transparent'
})
</script>
