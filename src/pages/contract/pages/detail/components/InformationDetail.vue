<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
    <BaseContainer>
      <DisplayList :items="customerItems">
        <template #[`value.idCard`]="{ value }">
          <span>{{ visibleCitizenId ? value : '*************' }}</span>
          <Icon
            :icon="visibleCitizenId ? 'famicons:eye-outline' : 'famicons:eye-off-outline'"
            class="cursor-pointer text-red-700"
            @click="toggleVisibleCitizenId()" />
        </template>
      </DisplayList>
      <template v-if="data.customers.length > 1">
        <Divider />
        <button
          class="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          type="button"
          @click="showModal = true">
          <Icon icon="solar:add-circle-bold" />
          ดูผู้กู้ทั้งหมด (+{{ data.customers.length - 1 }})
        </button>
      </template>
    </BaseContainer>

    <BaseContainer>
      <DisplayList :items="contractItems">
        <template #[`value.status`]>
          <ChipContractStatus :value="data.status" />
        </template>
      </DisplayList>
      <Divider />
      <DisplayList :items="loanItems" />
    </BaseContainer>
  </div>

  <AllBorrowersModal
    v-model:visible="showModal"
    :customers="data.customers" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IContractById, IContractCustomer } from '@/models/response/contract/ContractRes.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import Divider from '@/volt/Divider.vue'
import { Icon } from '@iconify/vue'
import ChipContractStatus from '../../list/components/ChipContractStatus.vue'
import AllBorrowersModal from './AllBorrowersModal.vue'

interface IProps {
  data: IContractById
}

const props = defineProps<IProps>()

const { formatDate, formatAge } = useDayjs()

const visibleCitizenId = ref<boolean>(true)
const showModal = ref<boolean>(false)

const primaryCustomer = computed((): IContractCustomer | undefined => props.data.customers[0])

const customerItems = computed((): IDisplayList[] => {
  const c = primaryCustomer.value
  return [
    { key: 'idCard', label: 'เลขบัตรประชาชน', value: c?.idCard ? formatter.thaiCitizenId(c.idCard) : '-' },
    { key: 'name', label: 'ชื่อ', value: formatter.fullName({ titleName: (c?.titleName ?? undefined) as TTitleName, firstName: c?.firstName, lastName: c?.lastName }) },
    { key: 'birthDate', label: 'วันเดือนปีเกิด', value: formatDate(c?.birthDate ?? undefined) },
    { key: 'age', label: 'อายุ', value: c?.birthDate ? formatAge(c.birthDate) : '-' },
    { key: 'phoneNumber', label: 'เบอร์โทร', value: formatter.fullPhoneNumber({ phoneNumber: c?.phoneNumber, phoneNumber2: c?.phoneNumber2 }) },
    { key: 'mainAddress', label: 'ที่อยู่ตามบัตรประชาชน', value: c?.mainAddress ? formatter.fullAddress(c.mainAddress) : '-' }
  ]
})

const contractItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะ', value: props.data.status },
  { key: 'idNo', label: 'เลขที่สัญญา', value: props.data.idNo || '-' },
  { key: 'startDate', label: 'วันที่ทำสัญญา', value: formatDate(props.data.startDate) },
  { key: 'employee', label: 'พนักงาน', value: formatter.fullName(props.data.employee) }
])

const loanItems = computed((): IDisplayList[] => [
  { key: 'contractLoanPurpose', label: 'วัตถุประสงค์การกู้', value: props.data.contractLoanPurpose?.name || '-' },
  { key: 'howDidFindUs', label: 'รู้จักมิตรแท้จากที่ไหน', value: props.data.howDidFindUs?.name || '-' }
])

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}
</script>
