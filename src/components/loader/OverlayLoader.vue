<template>
  <div
    v-if="isLoading"
    id="app-loader-overlay"
    class="overlay">
    <div class="loader" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/Loading'

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
  display: grid;
  place-content: center;
  position: fixed;
  z-index: 9999;
  background-color: #00000054;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  --b: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%,#f03355) content-box;
  -webkit-mask:
    repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
    radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
  -webkit-mask-composite: destination-in;
          mask-composite: intersect;
  animation:l4 1s infinite steps(10);
}
@keyframes l4 {to{transform: rotate(1turn)}}
</style>
