<template>
  <div class="p-6 space-y-6">
    <h1 class="text-xl font-semibold">
      ข่าวสาร
    </h1>
    <PostComposer
      @created="handleCreated()" />
    <FeedList
      :is-finished="list.isFinished.value"
      :items="list.items.value"
      :load-more="list.loadMore" />
  </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import PostComposer from '../components/composer/PostComposer.vue'
import FeedList from '../components/feed/FeedList.vue'
import useList from '../composables/useList'

const list = useList()
onMounted((): void => {
  list.fetch()
})
const handleCreated = async (): Promise<void> => {
  list.reset()
  list.fetch()
}

</script>
