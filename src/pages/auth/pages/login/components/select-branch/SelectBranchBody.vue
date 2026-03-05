<template>
  <div class="grid grid-cols-1 gap-2.5">
    <div
      v-for="(branch, i) in props.branches"
      :key="`branch-${i}`"
      :class="{
        'cursor-pointer hover:bg-gray-100 active:bg-gray-500 transition-all': !branch?.isNew
      }"
      class="grid grid-cols-1 gap-2 p-4 rounded-lg border-gray-400 border w-full bg-white"
      @click.passive="onSelect(branch)">
      <div class="flex justify-between items-center">
        <div class="text-sm grid grid-cols-1 gap-2">
          <span class="font-bold">สาขา: {{ branch.name }}</span>
          <span class="text-gray-500">ตำแหน่ง: {{ branch.role }}</span>
        </div>
        <div
          v-if="branch?.isNew"
          class="w-fit h-fit! p-2 bg-[#FF3B30] text-white">
          ใหม่
        </div>
        <Button
          v-else
          text>
          <Icon
            class="text-primary"
            icon="ic:round-login"
            width="32" />
        </Button>
      </div>
      <template v-if="branch?.isNew">
        <Divider class="my-0!" />
        <div class="flex gap-2.5 w-1/2">
          <ConfirmButton
            label="ยอมรับ"
            @click="emits('approve', branch.id)" />
          <ConfirmButton
            label="ปฏิเสธ"
            outlined
            @click="emits('reject', branch.id)" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import { Icon } from '@iconify/vue'

export interface IBranchResponse {
  id: number
  name: string
  role: string
  isNew: boolean
}

interface IProps {
  branches?: IBranchResponse[]
}
interface IEmits {
  approve: [branchId: number]
  reject: [branchId: number]
  submit: [branchId: number]
}

const props = withDefaults(defineProps<IProps>(), {
  branches: (): IBranchResponse[] => []
})
const emits = defineEmits<IEmits>()

function onSelect (branch: IBranchResponse): void {
  if (!branch?.isNew) emits('submit', branch.id)
}

</script>

<style scoped>

</style>
