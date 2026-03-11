<template>
  <section id="branch-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="branch"
          @delete="onDelete()"
          @edit="onEdit()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IBranchProvider } from '@/resources/provider/branch/Branch.provider'
import BranchProvider from '@/resources/provider/branch/Branch.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const BranchService: IBranchProvider = new BranchProvider()

const branch = useInitDetail()
const branchId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  const { data } = await BranchService.getBranchFindOne(branchId.value)
  branch.value = useInitDetail(data).value
}

async function useDelete (): Promise<void> {
  if (!branchId.value) throw new Error('Branch ID is required for deletion')
  await BranchService.deleteBranch(branchId.value)
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'BranchListPage' })
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'BranchEditPage', params: { id: branchId.value } })
}

function onDelete (): void {
  handleLoading(useDelete)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
