<template>
  <BasePage>
    <div class="space-y-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :content="post.content"
        :files="post.files" />
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
import BasePage from '@/components/base/BasePage.vue'
import PostCard from './PostCard.vue'

interface Post {
  id: string
  content: string
  files: IUploadResponse[]
}

const posts = ref<Post[]>([
  {
    id: '1',
    content: `
      <p>🎯 กิจกรรม & กำหนดการ</p>
      <ul>
        <li>📅 วันที่: 22–23 มีนาคม 2026</li>
        <li>📍 สถานที่: เขาใหญ่</li>
        <li>💬 ธีม: Grow Together</li>
      </ul>
    `,
    files: [
      { name: 'เอกสาร.pdf', path: 'www.google.com', url: 'www.google.com' },
      { name: 'เอกสาร2.pdf', path: 'www.google.com', url: 'www.google.com' }
    ]
  }
])
</script>
