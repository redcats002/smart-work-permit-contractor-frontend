<template>
  <Form
    :key="formKey"
    v-slot="$form"
    :initial-values="model"
    :resolver="resolver"
    class="flex flex-col gap-5"
    @submit="emits('submit', $event)">
    <BaseContainer>
      <InformationForm
        v-model="model"
        :form="$form" />
    </BaseContainer>
    <BaseContainer>
      <LocationForm
        v-model="model"
        :form="$form"
        @mount="mount()" />
    </BaseContainer>
    <LocationTable :items="model.locations" />
    <FormAction @cancel="emits('cancel')" />
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import FormAction from '@/components/button/FormAction.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import LocationTable from '../../detail/components/LocationTable.vue'
import { type WarehouseFormValues, WarehouseSchema } from '../schema/warehouse.schema'
import InformationForm from './InformationForm.vue'
import LocationForm from './LocationForm.vue'

interface IEmits {
  submit: [event: FormSubmitEvent]
  cancel: []
}

const emits = defineEmits<IEmits>()
const model = defineModel<WarehouseFormValues>({ required: true })

const formKey = ref<number>(0)
const resolver = zodResolver(WarehouseSchema)

function mount (): void {
  formKey.value++
}

defineExpose({ mount })
</script>
