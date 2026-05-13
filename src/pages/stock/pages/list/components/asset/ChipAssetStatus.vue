<template>
  <BaseChip
    :append-icon="getIcon(props.value)"
    :label="formatTitle(props.value)"
    :wrapper-class="getStatusClass(props.value)" />
</template>

<script setup lang="ts">
import { formatTitle, getIcon, getStatusClass, type TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import BaseChip from '@/components/chip/BaseChip.vue'

interface IProps {
  value?: TAssetStatus
}

const props = withDefaults(defineProps<IProps>(), {
  value: undefined
})

</script>

<style scoped>

</style>
