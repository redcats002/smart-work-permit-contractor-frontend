<template>
  <section id="warehouse-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="warehouse"
          @delete="onDelete()"
          @edit="onEdit()" />
        <LocationTable
          :items="warehouse?.locations || []"
          readonly
          @update="fetch()" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationDetail from '../components/InformationDetail.vue'
import LocationTable from '../components/LocationTable.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const warehouse = useInitDetail()
const warehouseId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  const { data } = await WarehouseService.getWarehouseFindOne(warehouseId.value)
  warehouse.value = useInitDetail(data).value
}

async function useDelete (): Promise<void> {
  if (!warehouseId.value) throw new Error('Warehouse ID is required for deletion')
  await WarehouseService.deleteWarehouse(warehouseId.value)
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'WarehouseListPage' })
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'WarehouseEditPage', params: { id: warehouseId.value } })
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
