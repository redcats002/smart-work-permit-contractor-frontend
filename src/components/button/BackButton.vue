<template>
  <Button
    v-bind="$attrs"
    :as="isBack ? RouterLink : 'button'"
    :to="isBack ? route.meta.back : {}"
    class="bg-white! md:bg-transparent! text-[#333333]! px-4
    border! border-gray-200! md:border-none
    flex items-center hover:bg-gray-100!"
    text
    @click="validate()">
    <Icon
      class="size-5 text-[#62748E]"
      icon="lets-icons:back-light" />
    <div class="text-sm font-bold hidden md:block">
      ย้อนกลับ
    </div>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()

const isBack = computed<boolean>((): boolean => !!route?.meta?.back)


function validate (): void {
  if (!isBack.value) {
    router.back()
    return toast.warn('ไม่ได้ตั้งค่าเส้นทางย้อนกลับ')
  }
}

</script>

<style scoped>

</style>
