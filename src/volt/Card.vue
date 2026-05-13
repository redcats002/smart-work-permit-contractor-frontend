<template>
    <Card
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card, {
  type CardPassThroughOptions,
  type CardProps
} from 'primevue/card'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ CardProps {}
defineProps<Props>();

const theme = ref<CardPassThroughOptions>({
    // border border-surface-300 dark:border-surface-700
    root: `flex flex-col rounded-lg
        bg-white dark:bg-surface-900 
        text-surface-700 dark:text-surface-0
        my-2
        shadow-[0_0_10px_4px_rgba(16,69,212,0.10)]`,
    header: ``,
    body: `p-5 flex flex-col gap-2`,
    caption: `flex flex-col gap-2`,
    title: `font-medium text-xl`,
    subtitle: `text-surface-500 dark:text-surface-400`,
    content: ``,
    footer: ``
});
</script>
