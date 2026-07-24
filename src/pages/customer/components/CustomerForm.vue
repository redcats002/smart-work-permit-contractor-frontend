<template>
  <BaseContainer>
    <InformationForm
      v-model="model"
      v-model:form-key="formKey"
      :disable-personal-type="disablePersonalType"
      :form="form" />
  </BaseContainer>
  <BaseContainer>
    <AddressForm
      v-model="mainAddress"
      :form="form"
      :personal-type="model.personalType"
      type="MAIN"
      @use-same-citizen-address="mount()"
      @use-same-current-address="mount()" />
  </BaseContainer>
  <template v-if="!isCorporate">
    <BaseContainer>
      <AddressForm
        v-model="currentAddress"
        :citizen-address="mainAddress"
        :form="form"
        :personal-type="model.personalType"
        type="CURRENT"
        @use-same-citizen-address="mount()"
        @use-same-current-address="mount()" />
    </BaseContainer>
    <BaseContainer>
      <AddressForm
        v-model="workAddress"
        :citizen-address="mainAddress"
        :current-address-ref="currentAddress"
        :form="form"
        :personal-type="model.personalType"
        type="WORK"
        @use-same-citizen-address="mount()"
        @use-same-current-address="mount()" />
    </BaseContainer>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import { PersonalTypeEnum } from '@/enums/modules/customer/PersonalType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AddressForm from '@/components/input/AddressForm.vue'
import InformationForm from '@/pages/customer/pages/create/components/InformationForm.vue'
import type { CustomerFormValues } from '@/pages/customer/pages/create/schema/customer.schema'

interface IProps {
  form?: IFormState
  disablePersonalType?: boolean
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  disablePersonalType: false
})

const model = defineModel<CustomerFormValues>({ required: true })
const formKey = defineModel<number>('formKey', { required: true })

const isCorporate = computed((): boolean => model.value?.personalType === PersonalTypeEnum.CORPORATE)

const mainAddress = computed({
  get (): IAddressRequest { return model.value.mainAddress },
  set (e: IAddressRequest): void { model.value.mainAddress = e }
})
const currentAddress = computed({
  get (): IAddressRequest { return model.value.currentAddress },
  set (e: IAddressRequest): void { model.value.currentAddress = e }
})
const workAddress = computed({
  get (): IAddressRequest { return model.value.workAddress },
  set (e: IAddressRequest): void { model.value.workAddress = e }
})

function mount (): void {
  formKey.value++
}
</script>

<style scoped>

</style>
