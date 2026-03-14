<template>
  <div class="p-6 space-y-6">
    <h1 class="text-xl font-semibold">
      ข่าวสาร
    </h1>


    <PostComposer />
    <FeedList />
  </div>
</template>

<script setup lang="ts">
import PostComposer from '../components/composer/PostComposer.vue'
import FeedList from '../components/feed/FeedList.vue'


</script>
