<template>
  <div class="grid grid-cols-1 gap-2.5 max-h-100 overflow-auto">
    <template v-if="branches.length">
      <div
        v-for="(branch, i) in branches"
        :id="`branch-${i}`"
        :key="`branch-${i}`"
        class="grid grid-cols-1 gap-2 p-4 rounded-lg border-gray-400 border w-full bg-white cursor-pointer hover:bg-gray-100 active:bg-gray-500 transition-all"
        @click.passive="onSelect(branch)">
        <div class="flex justify-between items-center">
          <div class="text-sm grid grid-cols-1 gap-2">
            <span class="font-bold">สาขา: {{ branch.name }}</span>
            <span class="text-gray-500">ตำแหน่ง: {{ formatTitle(branch.role) }}</span>
          </div>
          <!-- <div
          v-if="branch?.isNew"
          class="w-fit h-fit! p-2 bg-[#FF3B30] text-white">
          ใหม่
        </div> -->
          <Button text>
            <Icon
              class="text-primary"
              icon="ic:round-login"
              width="32" />
          </Button>
        </div>
        <!-- <template v-if="branch?.isNew">
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
      </template> -->
      </div>
    </template>
    <div
      v-else
      class="grid place-content-center gap-4">
      <span class="text-gray-500">ไม่มีสาขาที่สามารถเข้าสู่ระบบได้</span>
      <Button @click="onByPass()">
        By passing to dashboard
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { IAuthBranchList } from '@/models/response/auth/private/AuthRes.private.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { formatTitle } from '@/enums/modules/employee/EmployeeRole.enum'
import { Icon } from '@iconify/vue'

interface IProps {
  branches?: IAuthBranchList[]
}
interface IEmits {
  approve: [branchId: TBaseParamsId]
  reject: [branchId: TBaseParamsId]
  submit: [branch: IAuthBranchList]
}

withDefaults(defineProps<IProps>(), {
  branches: (): IAuthBranchList[] => []
})
const emits = defineEmits<IEmits>()

const router = useRouter()

function onSelect (branch: IAuthBranchList): void {
  if (!branch?.id) return
  emits('submit', branch)
}

function onByPass (): void {
  router.push({ name: 'CustomerListPage' })
}
</script>

<style scoped></style>
