<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass, type TAssetAssessmentStatus } from '@/enums/modules/contract/AssetAssessmentStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'

interface IProps {
  value?: TAssetAssessmentStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})
</script>
