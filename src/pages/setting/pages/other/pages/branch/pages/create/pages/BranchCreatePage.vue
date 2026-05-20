<template>
  <section id="branch-create-page">
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
              v-model:form-key="formKey"
              :form="$form" />
          </BaseContainer>
          <BaseContainer>
            <AddressForm
              v-model="mainAddress"
              :form="$form" />
          </BaseContainer>
          <BaseContainer>
            <BranchTimeForm
              v-model="form"
              v-model:form-key="formKey"
              :form="$form" />
          </BaseContainer>
          <FormAction
            :confirm-disabled="isDisabled"
            @cancel="onCancel()" />
        </Form>
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TErrorResponse } from '@/models/response/Response.model'
import type { EDays } from '@/enums/Date.enum'
import type { IBranchProvider } from '@/resources/provider/branch/Branch.provider'
import BranchProvider from '@/resources/provider/branch/Branch.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import AddressForm from '../components/AddressForm.vue'
import BranchTimeForm from '../components/BranchTimeForm.vue'
import InformationForm from '../components/InformationForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload'
import { type BranchFormValues, BranchSchema, formatBranchErrorMessage, useDev, useFormInitialValues } from '../schema/branch.schema'

const router = useRouter()

const BranchService: IBranchProvider = new BranchProvider()

const formKey = ref<number>(0)
const form = ref<BranchFormValues>(useFormInitialValues())
const resolver = zodResolver(BranchSchema)

interface IBranchItem {
  day: EDays[]
  openTime: string
  closeTime: string
}

const mainAddress = computed({
  get (): IAddressRequest {
    return {
      address: form.value?.address || '',
      subDistrict: form.value?.subDistrict || '',
      district: form.value?.district || '',
      province: form.value?.province || '',
      postCode: form.value?.postCode || ''
    }
  },
  set (e: IAddressRequest): void {
    form.value.address = e.address
    form.value.subDistrict = e.subDistrict
    form.value.district = e.district
    form.value.province = e.province
    form.value.postCode = e.postCode
  }
})

const isDisabled = computed((): boolean => {
  const times = form.value.branchTimes

  if (!times || times.length === 0) {
    return true
  }

  const hasInvalidRow = times.some((item: IBranchItem): boolean => {
    const isDayEmpty = !item.day || item.day.length === 0
    const isOpenTimeEmpty = !item.openTime || item.openTime.trim() === ''
    const isCloseTimeEmpty = !item.closeTime || item.closeTime.trim() === ''

    return isDayEmpty || isOpenTimeEmpty || isCloseTimeEmpty
  })

  return hasInvalidRow
})

async function useSubmit (): Promise<void> {
  await BranchService.createBranch(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'BranchListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    const firstErrorMessage = Object.values(event.errors).flat()[0]?.message
    toast.error(firstErrorMessage || 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง')
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit, undefined, async (err: TErrorResponse): Promise<void> => {
    const errorMessage = formatBranchErrorMessage(err?.message, form.value.name)
    toast.error('', errorMessage)
  })
}

function onCancel (): void {
  router.push({ name: 'BranchListPage' })
}

function onAuto (): void {
  form.value = { ...useDev() }
  formKey.value++
}

</script>

<style scoped>

</style>
