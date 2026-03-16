<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass, type TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'

interface IProps {
  value?: TEstateStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})

</script>

<style scoped>

</style>
