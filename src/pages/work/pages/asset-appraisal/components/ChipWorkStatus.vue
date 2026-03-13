<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass } from '@/enums/modules/work/WorkStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'
import type { TWorkStatus } from '@/enums/modules/work/WorkStatus.enum'

interface IProps {
  value?: TWorkStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})
</script>
