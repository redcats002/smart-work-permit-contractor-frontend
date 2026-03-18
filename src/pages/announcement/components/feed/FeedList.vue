<template>
  <BasePage>
    <div class="space-y-4">
      <PostCard
        v-for="post in props.items"
        :key="post.id"
        :author-name="post.author.name"
        :content="post.content"
        :created-at="post.createdAt"
        :files="post.attachments"
        :role="post.author.role" />
      <div
        ref="loadMoreRef"
        class="h-10 flex items-center justify-center">
        <span v-if="!isFinished">กำลังโหลด...</span>
        <span v-else>หมดแล้ว</span>
      </div>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import BasePage from '@/components/base/BasePage.vue'
import PostCard from './PostCard.vue'


const props = defineProps<{
  items: any[]
  loadMore: () => Promise<void>
  isFinished: boolean
}>()

const loadMoreRef = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)
const isLoading = ref(false)

onMounted((): void => {
  observer.value = new IntersectionObserver(async (entries: IntersectionObserverEntry[]): Promise<void> => {
    const entry = entries[0]

    if (entry.isIntersecting && !props.isFinished && !isLoading.value) {
      isLoading.value = true
      await props.loadMore()
      isLoading.value = false
    }
  })

  if (loadMoreRef.value) {
    observer.value.observe(loadMoreRef.value)
  }
})

onBeforeUnmount((): void => {
  observer.value?.disconnect()
})

</script>
