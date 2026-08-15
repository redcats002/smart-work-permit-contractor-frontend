<template>
  <div class="flex flex-col items-center gap-3">
    <div
      aria-hidden="true"
      class="flex size-11 items-center justify-center rounded-[10px] bg-(--color-accent-500) text-lg font-bold text-white">
      {{ t('platform.appName').slice(0, 1) }}
    </div>
    <div class="flex flex-col items-center gap-0.5">
      <span class="text-[13.5px] font-semibold tracking-[0.5px] text-(--color-text-primary)">
        {{ t('platform.appName') }}
      </span>
      <span class="text-[10px] font-medium tracking-[0.5px] text-(--color-text-tertiary)">
        {{ t('platform.appTagline') }}
      </span>
    </div>
    <h1 class="mt-2 text-center text-xl font-bold text-(--color-text-primary) sm:text-2xl">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-center text-sm text-(--color-text-secondary)">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface IProps {
  title: string
  description?: string
}

withDefaults(defineProps<IProps>(), {
  description: ''
})

const { t } = useI18n()
</script>

<style scoped>

</style>
