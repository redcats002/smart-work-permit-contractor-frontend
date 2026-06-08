<template>
  <div class="space-y-4">
    <PostCard
      v-for="(post, i) in items"
      :id="Number(post.id)"
      :key="post.id"
      :author-name="post.author.name"
      :content="post.content"
      :created-at="post.createdAt"
      :files="post.attachments"
      :image="post.author.image"
      :is-read="post.isRead"
      :order="i"
      :role="post.author.role"
      @deleted="emits('refresh')"
      @updated="emits('refresh')" />
    <div
      ref="loadMoreRef"
      class="h-10 flex items-center justify-center">
      <span v-if="!isFinished">กำลังโหลด...</span>
      <span v-else>หมดแล้ว</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { IAnnouncementList } from '@/models/response/announcement/AnnouncementRes.model'
import PostCard from './PostCard.vue'

interface IProps {
  items: IAnnouncementList[]
  loadMore: () => Promise<void>
  isFinished: boolean
}

interface IEmits {
  refresh: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

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
