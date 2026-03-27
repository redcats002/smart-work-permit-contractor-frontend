<template>
  <UploadInput
    v-model="media"
    class="border border-dashed border-gray-300 rounded-md" />
</template>

<script setup lang="ts">
import type { IMedia } from '@/resources/provider/Upload.provider'
import UploadInput from '@/components/input/UploadInput.vue'

const media = defineModel<IMedia[]>({ required: true })

</script>
