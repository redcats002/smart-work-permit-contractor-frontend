<template>
  <DefaultLayout
    v-if="pageReady && layoutName === 'default'"
    class="layout-default" />
  <BlankLayout
    v-else-if="pageReady && layoutName === 'blank'"
    class="layout-blank" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

const pageReady = ref<boolean>(false)

const layoutName = computed((): string => {
  const layout = route.meta?.layout as string
  return layout?.toLowerCase() || 'default'
})

onMounted((): void => {
  pageReady.value = true
})
</script>
