<template>
  <Button
    v-bind="$attrs"
    :as="isBack ? RouterLink : 'button'"
    :to="isBack ? resolvedBack : {}"
    class="bg-white! md:bg-transparent! text-[#333333]! px-4
    border! border-gray-200! md:border-none
    flex items-center hover:bg-gray-200!"
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
import useDev from '@/composables/useDev'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const { isDev } = useDev()

const isBack = computed<boolean>((): boolean => !!route?.meta?.back)

type RouteBack = { name: string, params?: Record<string, string>, query?: Record<string, string> }

const resolvedBack = computed<RouteBack | undefined>((): RouteBack | undefined => {
  const back = route.meta.back as RouteBack | undefined
  if (!back) return undefined
  const resolve = (obj: Record<string, string>): Record<string, string> =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]: any): any => [k, String(v).startsWith(':') ? String(route.params[v.slice(1)] ?? v) : v])
    )
  return {
    ...back,
    ...(back.params ? { params: resolve(back.params) } : {}),
    ...(back.query ? { query: resolve(back.query) } : {})
  }
})

function validate (): void {
  if (!isBack.value) {
    router.back()
    if (isDev.value) toast.warn('ไม่ได้ตั้งค่าเส้นทางย้อนกลับ')
  }
}

</script>

<style scoped>

</style>
