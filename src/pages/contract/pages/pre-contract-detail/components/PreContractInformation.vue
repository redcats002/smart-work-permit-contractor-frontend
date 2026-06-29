<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    <BaseContainer class="md:col-span-2">
      <DisplayList :items="items">
        <template #[`value.idCard`]="{ value }">
          <CitizenId
            :value="value" />
        </template>
      </DisplayList>
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="contractItems">
        <template #[`value.status`]>
          <ChipAssetStatus :value="data?.status ?? undefined" />
        </template>
      </DisplayList>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import ChipAssetStatus from '../../list/components/ChipPreContractStatus.vue'

interface IProps {
  data: IPreContractById | null
}

const props = defineProps<IProps>()

const { formatDate, formatAge } = useDayjs()


const contractItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะ', value: props.data?.status },
  { key: 'idNo', label: 'เลขที่สัญญา', value: props.data?.idNo || '-' },
  { key: 'createdAt', label: 'วันที่', value: formatDate(props.data?.contractedAt ?? undefined) },
  { key: 'sellMan', label: 'พนักงาน', value: formatter.fullName(props.data?.sellMan) }
])

const items = computed((): IDisplayList[] => {
  const c = props.data?.customer
  if (!c) return []
  return [
    { key: 'name', label: 'ชื่อลูกค้า', value: formatter.fullName({ titleName: (c.titleName ?? undefined) as TTitleName | undefined, firstName: c.firstName ?? undefined, lastName: c.lastName ?? undefined }) },
    { key: 'idNo', label: 'เลขที่ลูกค้า', value: c.idNo || '-' },
    { key: 'idCard', label: 'เลขบัตรประชาชน', value: c.idCard || '-' },
    { key: 'birthDate', label: 'วันเดือนปีเกิด', value: formatDate(c.birthDate ?? undefined) },
    { key: 'age', label: 'อายุ', value: c.birthDate ? formatAge(c.birthDate) : '-' },
    { key: 'customerGroup', label: 'กลุ่มลูกค้า', value: c.customerGroup?.name || '-' },
    { key: 'occupation', label: 'อาชีพ', value: c.occupation?.name || '-' },
    { key: 'phone', label: 'เบอร์โทร', value: formatter.fullPhoneNumber({ phoneNumber: c.phoneNumber ?? undefined, phoneNumber2: c.phoneNumber2 ?? undefined }) },
    { key: 'email', label: 'อีเมล', value: c.email || '-' }
  ]
})

</script>

<style scoped>

</style>
