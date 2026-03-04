<template>
  <Button
    v-bind="$attrs"
    :as="isBack ? RouterLink : 'button'"
    :to="isBack ? route.meta.back : {}"
    class="bg-transparent! text-[#333333]! px-4 border-none flex items-center hover:bg-gray-100!"
    text>
    <Icon
      class="size-5 text-[#62748E]"
      icon="lets-icons:back-light" />
    <div class="text-sm font-medium">
      ย้อนกลับ
    </div>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()

const isBack = computed<boolean>((): boolean => !!route?.meta?.back)


</script>

<style scoped>

</style>
