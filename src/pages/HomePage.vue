<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted((): void => {
  router.replace({ name: 'CustomerListPage' })
})
</script>

<style scoped></style>
