<template>
  <section id="warehouse-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ConfirmButton
        label="Auto"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import WarehouseProvider from '@/resources/provider/warehouse/Warehouse.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationForm from '../components/InformationForm.vue'
import LocationForm from '../components/LocationForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import LocationTable from '../../detail/components/LocationTable.vue'
import { usePayload } from '../composables/usePayload'
import { useDev, useFormInitialValues, type WarehouseFormValues, WarehouseSchema } from '../schema/warehouse.schema'

const router = useRouter()

const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const formKey = ref<number>(0)
const form = ref<WarehouseFormValues>(useFormInitialValues())
const resolver = zodResolver(WarehouseSchema)


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
  formKey.value++
}

</script>

<style scoped>

</style>
