<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass, type TEstateAssessmentStatus } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'

interface IProps {
  value?: TEstateAssessmentStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})
</script>
