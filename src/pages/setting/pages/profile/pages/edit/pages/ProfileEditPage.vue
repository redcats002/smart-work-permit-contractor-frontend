<template>
  <section id="profile-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage class="flex flex-col md:grid md:grid-cols-3 gap-4">
      <BaseContainer class="h-fit md:order-2 md:col-span-1">
        <UploadInput
          v-model="media"
          :model-image="form.image"
          accept="image/*"
          button-upload-class="bg-primary text-white"
          detail="ไฟล์ JPG, JPEG และ PNG ได้รับอนุญาต"
          label="เลือกเพื่ออัปโหลดหรือลากและวาง"
          hide-icon-button
          single>
          <template #placeholderIcon>
            <div class="p-1.5 rounded-lg border border-(--p-gray-5)">
              <div class="bg-(--p-gray-5) rounded-xl">
                <Icon
                  class="size-12 text-(--p-gray-4)"
                  icon="solar:user-bold" />
              </div>
            </div>
          </template>
        </UploadInput>
      </BaseContainer>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 col-span-2"
        @submit="onSubmit($event)">
        <BaseContainer>
          <InformationForm
            v-model="form"
            :form="$form" />
        </BaseContainer>
        <FormAction @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IEmployeeById } from '@/models/response/employee/EmployeeRes.model'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationForm from '@/pages/employee/pages/create/components/InformationForm.vue'
import { type EmployeeFormValues, EmployeeSchema, useFormInitialValues } from '@/pages/employee/pages/create/schema/employee.schema'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload'

const router = useRouter()
const authStore = useAuthStore()

const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const formKey = ref<number>(0)
const form = ref<EmployeeFormValues>(useFormInitialValues())
const resolver = zodResolver(EmployeeSchema)
const { media, getUploadImages } = useUpload()

async function useSubmit (): Promise<void> {
  const employeeId = authStore.user.id
  if (!employeeId) return
  const images = await getUploadImages()
  await EmployeeService.updateEmployee(employeeId, usePayload(form.value, images))
  authStore.updateUser({
    title: form.value.title,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email
  })
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ProfileDetailPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

async function useFetch (): Promise<void> {
  const employeeId = authStore.user.id
  if (!employeeId) return
  const { data } = await EmployeeService.getEmployeeFindOne(employeeId)
  useInit(data)
}

function onCancel (): void {
  router.push({ name: 'ProfileDetailPage' })
}

function useInit (data: IEmployeeById): void {
  useInitForm(form, data)
  formKey.value++
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>

<style scoped></style>
