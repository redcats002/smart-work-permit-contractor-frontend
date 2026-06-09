<template>
  <div class="grid grid-cols-1 gap-2.5">
    <BaseContainer>
      <DisplayList :items="customerItems">
        <template #[`value.idCard`]="{ value }">
          <CitizenId :value="value" />
        </template>
      </DisplayList>
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="contractItems">
        <template #[`value.status`]>
          <ChipContractStatus :value="detail.status" />
        </template>
      </DisplayList>
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="loanItems" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IContractById, IContractCustomer } from '@/models/response/contract/ContractRes.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import { useInitDetail } from '@/pages/contract/pages/detail/composables/useInitDetail'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipContractStatus from '@/pages/contract/pages/list/components/ChipContractStatus.vue'

interface IProps {
  data: Record<string, unknown>
}

const props = defineProps<IProps>()
const { formatDate, formatAge } = useDayjs()

const detail = computed((): IContractById => useInitDetail(props.data as Partial<IContractById>).value)

const primaryCustomer = computed((): IContractCustomer | undefined => detail.value.borrowers?.[0]?.customer)

const customerItems = computed((): IDisplayList[] => {
  const c = primaryCustomer.value
  return [
    { key: 'idCard', label: 'เลขบัตรประชาชน', value: c?.idCard || '-' },
    { key: 'name', label: 'ชื่อ', value: formatter.fullName({ titleName: (c?.titleName ?? undefined) as TTitleName, firstName: c?.firstName, lastName: c?.lastName }) },
    { key: 'birthDate', label: 'วันเดือนปีเกิด', value: formatDate(c?.birthDate ?? undefined) },
    { key: 'age', label: 'อายุ', value: c?.birthDate ? formatAge(c.birthDate) : '-' },
    { key: 'phoneNumber', label: 'เบอร์โทร', value: formatter.fullPhoneNumber({ phoneNumber: c?.phoneNumber, phoneNumber2: c?.phoneNumber2 }) },
    { key: 'mainAddress', label: 'ที่อยู่ตามบัตรประชาชน', value: c?.mainAddress ? formatter.fullAddress(c.mainAddress) : '-' }
  ]
})

const contractItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะ', value: detail.value.status },
  { key: 'idNo', label: 'เลขที่สัญญา', value: detail.value.idNo || '-' },
  { key: 'contractedAt', label: 'วันที่ทำสัญญา', value: formatDate(detail.value.contractedAt) },
  { key: 'sellMan', label: 'พนักงาน', value: formatter.fullName(detail.value.sellMan) }
])

const loanItems = computed((): IDisplayList[] => [
  { key: 'contractLoanPurpose', label: 'วัตถุประสงค์การกู้', value: detail.value.contractLoanPurpose?.name || '-' },
  { key: 'howDidFindUs', label: 'รู้จักมิตรแท้จากที่ไหน', value: detail.value.howDidFindUs?.name || '-' }
])
</script>
