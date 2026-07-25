<template>
  <section id="warehouse-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <DevButton
        @click="onAuto()" />
    </BaseTop>
    <BasePage>
      <WarehouseForm
        ref="warehouseFormRef"
        v-model="form"
        @cancel="onCancel()"
        @submit="onSubmit($event)" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IWarehouseById } from '@/models/response/warehouse/WarehouseRes.model'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import type { FormSubmitEvent } from '@primevue/forms'
import WarehouseForm from '../../create/components/WarehouseForm.vue'
import { useDev, useFormInitialValues, type WarehouseFormValues } from '../../create/schema/warehouse.schema'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload'

const route = useRoute()
const router = useRouter()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()
const warehouseFormRef = useTemplateRef<InstanceType<typeof WarehouseForm>>('warehouseFormRef')

const form = ref<WarehouseFormValues>(useFormInitialValues())

const warehouseId = computed((): string => route.params?.id as string)

async function useSubmit (): Promise<void> {
  await WarehouseService.updateWarehouse(warehouseId.value, usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'WarehouseDetailPage', params: { id: warehouseId.value } })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

async function useFetch (): Promise<void> {
  const { data } = await WarehouseService.getWarehouseFindOne(warehouseId.value)
  useInit(data)
}

function onCancel (): void {
  router.push({ name: 'WarehouseDetailPage', params: { id: warehouseId.value } })
}

function onAuto (): void {
  form.value = { ...useDev() }
  warehouseFormRef.value?.mount()
}

function useInit (data: IWarehouseById): void {
  useInitForm(form, data)
  warehouseFormRef.value?.mount()
}

onMounted((): void => {
  useFetch()
})
</script>
