<template>
  <div class="flex items-center gap-2.5">
    <ToggleSwitch v-model="checked" />
    <span
      v-if="trueLabel || falseLabel"
      class="duration-300 font-bold text-base">{{ checked ? trueLabel : falseLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  trueLabel?: string
  falseLabel?: string
}

withDefaults(defineProps<IProps>(), {
  trueLabel: '',
  falseLabel: ''
})

const checked = defineModel<boolean>({ default: false })
</script>

<style scoped>

</style>
