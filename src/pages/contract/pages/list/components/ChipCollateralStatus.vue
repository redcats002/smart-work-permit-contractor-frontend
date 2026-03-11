<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass, type TCollateralAssessmentStatus } from '@/enums/modules/contract/CollateralAssessmentStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'

interface IProps {
  value?: TCollateralAssessmentStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})
</script>
