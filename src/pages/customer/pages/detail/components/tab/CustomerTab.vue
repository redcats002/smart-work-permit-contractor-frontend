<template>
  <BaseTab
    v-model="tab"
    :items="tabItems" />
  <BaseTabWindow
    v-slot="{ component, item }"
    v-model="tab"
    :items="tabItems">
    <component
      :is="component"
      :key="item?.value"
      :props="props"
      class="animate-fade-in"
      v-bind="props" />
  </BaseTabWindow>
</template>

<script setup lang="ts">
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import { useInitTabDetail } from '../../composables/_useInitDetail'

interface IProps {}

const props = defineProps<IProps>()

const { tab, tabItems } = useInitTabDetail()

</script>

<style scoped>

</style>
