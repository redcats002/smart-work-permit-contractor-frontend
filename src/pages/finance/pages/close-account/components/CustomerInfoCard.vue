<template>
  <BaseContainer>
    <div class="flex flex-col gap-2 max-w-3xl">
      <div class="flex items-center gap-1">
        <span class="text-sm font-bold text-[#303045] w-[247px]">สถานะ</span>
        <div class="bg-[#cfffe3] flex items-center gap-2 h-6 px-2 rounded">
          <Icon
            class="size-3 text-[#219653]"
            icon="icon-park-outline:check-one" />
          <span class="text-[10px] font-medium text-[#219653]">ใช้งาน</span>
        </div>
      </div>

      <div
        v-for="row in rows"
        :key="row.label"
        class="flex items-center gap-1 text-sm">
        <span class="font-bold text-[#303045] w-[247px]">{{ row.label }}</span>
        <span class="text-[#333d48]">:</span>
        <span class="font-normal text-[#333]">{{ row.value }}</span>
      </div>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseContainer from '@/components/base/BaseContainer.vue'

interface IInfoRow {
  label: string
  value: string | number
}

interface IProps {
  customerName?: string
  idCard?: string
  birthDate?: string
  age?: number | string
  customerGroup?: string
  occupation?: string
  phoneNumbers?: string
  email?: string
}

const props = withDefaults(defineProps<IProps>(), {
  customerName: 'นาย จันทร์ พงษ์พัฒนโยธิน',
  idCard: '6-6572-53440-73-4',
  birthDate: '12/3/40',
  age: '28',
  customerGroup: 'ลูกค้าใหม่',
  occupation: 'พนักงานบริษัทเอกชน',
  phoneNumbers: '088-8888888, 088-8888888',
  email: 'Pichai@mail.com'
})

const rows = computed<IInfoRow[]>((): IInfoRow[] => [
  { label: 'ชื่อลูกค้า', value: props.customerName },
  { label: 'เลขบัตรประชาชน', value: props.idCard },
  { label: 'วันเดือนปีเกิด', value: props.birthDate },
  { label: 'อายุ', value: props.age },
  { label: 'กลุ่มลูกค้า', value: props.customerGroup },
  { label: 'อาชีพ', value: props.occupation },
  { label: 'เบอร์โทร', value: props.phoneNumbers },
  { label: 'อีเมล', value: props.email }
])
</script>
