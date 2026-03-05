<template>
  <AppToast />
  <OverlayLoader />
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
import OverlayLoader from './components/loader/OverlayLoader.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppToast from '@/volt/Toast.vue'

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
