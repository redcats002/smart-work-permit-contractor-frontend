<template>
  <router-view v-slot="{ Component, route }">
    <UseTransition>
      <slot :component="Component">
        <component
          :is="Component"
          :key="route.path"
          ref="componentRef"
          v-bind="{
            ...componentProps,
            ...$attrs
          }" />
      </slot>
    </UseTransition>
  </router-view>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import UseTransition from './UseTransition.vue'

interface IProps {
  componentProps?: any
}

defineProps<IProps>()

const componentRef = useTemplateRef('componentRef')

defineExpose({ componentRef })
</script>

<style scoped>

</style>
