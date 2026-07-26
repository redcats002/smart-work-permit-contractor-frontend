<template>
  <section id="employee-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ReadIdentificationCardButton
        @read-success="onReadIdCard($event)" />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 col-span-2"
        @submit="onSubmit($event)">
        <div class="flex flex-col md:grid md:grid-cols-3 gap-4">
          <EmployeeForm
            v-model="form"
            v-model:form-key="formKey"
            v-model:media="media"
            :form="$form" />
        </div>
        <FormAction
          class="md:col-span-3"
          @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import type { IReadIdCardResult } from '@/components/button/ReadIdentificationCardButton.vue'
import ReadIdentificationCardButton from '@/components/button/ReadIdentificationCardButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import EmployeeForm from '@/pages/employee/components/EmployeeForm.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { mapIdCardToEmployee } from '../../create/composables/useIdCardMapper'
import { type EmployeeFormValues, EmployeeSchema, useFormInitialValues } from '../../create/schema/employee.schema'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload'

const route = useRoute()
const router = useRouter()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const formKey = ref<number>(0)
const form = ref<EmployeeFormValues>(useFormInitialValues())
const resolver = zodResolver(EmployeeSchema)
const { media, getUploadImages } = useUpload()

const employeeId = computed((): TBaseParamsId => route?.params?.id)

async function useFetch (): Promise<void> {
  const { data } = await EmployeeService.getEmployeeFindOne(employeeId.value)
  useInit(data)
}

async function useSubmit (): Promise<void> {
  const images = await getUploadImages()
  await EmployeeService.updateEmployee(employeeId.value, usePayload(form.value, images))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'EmployeeDetailPage', params: { id: employeeId.value } })
}


async function onSubmit (event: FormSubmitEvent): Promise<void> {
  mount()
  if (!event.valid) {
    scrollToFirstError(event.errors, true)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'EmployeeDetailPage', params: { id: employeeId.value } })
}

function useInit (data: IEmployeeById): void {
  useInitForm(form, data)
  mount()
}

function mount (): void {
  formKey.value++
}


function onReadIdCard (data: IReadIdCardResult): void {
  form.value = mapIdCardToEmployee(data, form.value)
  mount()
}

onMounted((): void => {
  useFetch()
})
</script>

<style scoped>

</style>
