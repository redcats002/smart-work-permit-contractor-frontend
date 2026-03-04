<template>
  <div
    v-if="isLoading"
    id="app-loader-overlay"
    class="overlay">
    <ProgressSpinner
      animation-duration=".5s"
      aria-label="Custom ProgressSpinner"
      fill="transparent"
      stroke-width="8"
      style="width: 50px; height: 50px" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import ProgressSpinner from 'primevue/progressspinner'

interface IProps {
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  loading: undefined
})

const loadingStore = useLoadingStore()

const isLoading = computed((): boolean => {
  if (props.loading === undefined) return loadingStore.isLoading
  return props.loading || loadingStore.isLoading
})

</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 9999;
  background-color: #00000054;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>
