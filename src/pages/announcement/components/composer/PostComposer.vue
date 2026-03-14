<template>
  <BasePage>
    <div class="bg-white rounded-xl border p-4 space-y-4">
      <div class="flex gap-3">
        <img
          class="w-10 h-10 rounded-full"
          src="https://www.pngall.com/wp-content/uploads/20/Cappuccino-Assassino-PNG.png">

        <div class="flex-1">
          <BaseEditor
            v-model="content"
            placeholder="เขียนประกาศ..." />
          <div
            class="mt-4">
            <FileInput />
          </div>
          <div class="mt-4">
            <Button
              class="bg-primary px-10 py-2 text-base"
              label="โพสต์" />
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseEditor from '@/components/base/BaseEditor.vue'
import FileInput from '@/components/input/FileInput.vue'
import BasePage from '@/components/base/BasePage.vue'

const content = ref('')
</script>
