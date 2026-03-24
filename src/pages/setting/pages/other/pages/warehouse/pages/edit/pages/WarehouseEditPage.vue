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
      <div>
        <Form
          :key="formKey"
          v-slot="$form"
          :initial-values="form"
          :resolver="resolver"
          class="flex flex-col gap-5"
          @submit="onSubmit($event)">
          <BaseContainer>
            <InformationForm
              v-model="form"
              :form="$form" />
          </BaseContainer>
          <BaseContainer>
            <LocationForm
              v-model="form"
              :form="$form" />
          </BaseContainer>
          <LocationTable :items="form.locations" />
          <FormAction @cancel="onCancel()" />
        </Form>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IWarehouseById } from '@/models/response/warehouse/WarehouseRes.model'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import InformationForm from '../../create/components/InformationForm.vue'
import LocationForm from '../../create/components/LocationForm.vue'
import { useDev, useFormInitialValues, type WarehouseFormValues, WarehouseSchema } from '../../create/schema/warehouse.schema'
import LocationTable from '../../detail/components/LocationTable.vue'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload'

const route = useRoute()
const router = useRouter()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const formKey = ref<number>(0)
const form = ref<WarehouseFormValues>(useFormInitialValues())
const resolver = zodResolver(WarehouseSchema)

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
  router.push({ name: 'WarehouseListPage' })
}

function onAuto (): void {
  form.value = { ...useDev() }
  formKey.value++
}

function useInit (data: IWarehouseById): void {
  useInitForm(form, data)
  formKey.value++
}

onMounted((): void => {
  useFetch()
})

</script>

<style scoped>

</style>
