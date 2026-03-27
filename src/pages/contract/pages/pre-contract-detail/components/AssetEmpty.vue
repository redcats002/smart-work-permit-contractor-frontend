<template>
  <div class="bg-(--p-gray-5) w-full p-4">
    <div
      class="flex items-center justify-center
    flex-wrap relative
    w-full aspect-square bg-white
    border border-surface-200 mb-4">
      <span class="text-base text-(--p-gray-5) font-bold basis-full text-center">ไม่มีข้อมูล</span>
      <div>
        <span
          class="rounded-full px-2 w-fit text-white text-[8px] bg-(--p-gray-5)
        absolute bottom-2 translate-x-1/2 right-1/2">0/0</span>
      </div>
    </div>
    <div class="flex gap-2 px-6 justify-center">
      <div
        v-for="i in 4"
        :key="`box-empty-${i}`"
        class="w-23 aspect-square bg-white" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
