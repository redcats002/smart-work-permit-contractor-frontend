<template>
  <BaseModal
    v-model="visible"
    class="md:w-7xl!"
    label="กรอกข้อมูลหลักทรัพย์"
    @open="emits('open', asset)">
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 my-2">
        <Form
          v-if="isVehicle"
          :key="formKey"
          ref="formRef"
          v-slot="$form"
          :initial-values="form.vehicleForm"
          :resolver="vehicleResolver"
          @submit="onSubmit($event)">
          <Card>
            <template #title>
              <span class="font-bold text-base">รายละเอียดหลักทรัพย์</span>
            </template>
            <template #content>
              <VehicleForm
                v-model="form.vehicleForm"
                v-model:detail="form.detail"
                v-model:type="form.type"
                :form="$form" />
            </template>
          </Card>
        </Form>
        <Form
          v-if="isLand"
          :key="formKey"
          ref="formRef"
          v-slot="$form"
          :initial-values="form.realEstateForm"
          :resolver="landResolver"
          @submit="onSubmit($event)">
          <Card>
            <template #title>
              <span class="font-bold text-base">รายละเอียดหลักทรัพย์</span>
            </template>
            <template #content>
              <LandForm
                v-model="form.realEstateForm"
                v-model:detail="form.detail"
                v-model:type="form.type"
                :form="$form" />
            </template>
          </Card>
        </Form>
        <Form
          v-if="isApartment"
          :key="formKey"
          ref="formRef"
          v-slot="$form"
          :initial-values="form.apartmentCondoForm"
          :resolver="apartmentResolver"
          @submit="onSubmit($event)">
          <Card>
            <template #title>
              <span class="font-bold text-base">รายละเอียดหลักทรัพย์</span>
            </template>
            <template #content>
              <ApartmentForm
                v-model="form.apartmentCondoForm"
                v-model:detail="form.detail"
                v-model:type="form.type"
                :form="$form" />
            </template>
          </Card>
        </Form>
        <Card class="h-fit">
          <template #title>
            <span class="font-bold text-base">รูปหลักทรัพย์</span>
          </template>
          <template #content>
            <ImageSection v-model="form.images" />
          </template>
        </Card>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex items-center gap-3">
        <FormAction
          confirm-label="บันทึก"
          @cancel="close()"
          @confirm="onSave(close)">
          <Button
            class="text-sm text-red-500 hover:text-red-700 transition-colors h-10.5"
            type="button"
            text
            @click="onClear()">
            ล้างข้อมูล
          </Button>
        </FormAction>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IFormType } from '@/models/Form.model'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isApartmentAsset, isLandAllAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import FormAction from '@/components/button/FormAction.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { ModalApartmentSchema } from '../../schema/apartment.schema'
import { ModalLandSchema } from '../../schema/land.schema'
import { type PreAssetUpdateValues, useInitForm } from '../../schema/pre-asset.schema'
import { ModalVehicleSchema } from '../../schema/vehicle.schema'
import ApartmentForm from './ApartmentForm.vue'
import ImageSection from './ImageSection.vue'
import LandForm from './LandForm.vue'
import VehicleForm from './VehicleForm.vue'

interface IProps {
  asset: IPreAssetList
  contractId: TBaseParamsId
}

interface IEmits {
  open: [asset: IPreAssetList]
  saved: []
  mount: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })
const form = defineModel<PreAssetUpdateValues>('form', { required: true })
const formKey = defineModel<number>('formKey', { required: true })

const formRef = useTemplateRef<IFormType>('formRef')

const vehicleResolver = zodResolver(ModalVehicleSchema)
const landResolver = zodResolver(ModalLandSchema)
const apartmentResolver = zodResolver(ModalApartmentSchema)

const pendingClose = ref<(() => void) | null>(null)

const isVehicle = computed((): boolean => isVehicleAsset(props.asset.type))
const isLand = computed((): boolean => isLandAllAsset(props.asset.type))
const isApartment = computed((): boolean => isApartmentAsset(props.asset.type))


function onClear (): void {
  const initialForm = useInitForm()
  form.value = initialForm
  toast.success('ล้างข้อมูลสำเร็จ')
  emits('mount')
}

function useSave (): void {
  emits('saved')
}

async function onSave (close: () => void): Promise<void> {
  pendingClose.value = close
  formRef.value?.submit()
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading((): void => {
    useSave()
    pendingClose.value?.()
    pendingClose.value = null
  })
}


</script>
