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
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import WarehouseForm from '../components/WarehouseForm.vue'
import type { FormSubmitEvent } from '@primevue/forms'
import { usePayload } from '../composables/usePayload'
import { useDev, useFormInitialValues, type WarehouseFormValues } from '../schema/warehouse.schema'

const router = useRouter()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()
const warehouseFormRef = useTemplateRef<InstanceType<typeof WarehouseForm>>('warehouseFormRef')

const form = ref<WarehouseFormValues>(useFormInitialValues())

async function useSubmit (): Promise<void> {
  await WarehouseService.createWarehouse(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'WarehouseListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'WarehouseListPage' })
}

function onAuto (): void {
  form.value = { ...useDev() }
  warehouseFormRef.value?.mount()
}
</script>
