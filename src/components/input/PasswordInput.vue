<template>
  <Password
    v-bind="$attrs"
    :feedback="false"
    fluid
    toggle-mask>
    <!--
      wayfinder ticket 028. Volt's Password.vue (src/volt/Password.vue) — never edited to fix a
      call site — renders these icons as a bare `@click` SVG with no `role`, no `tabindex` and no
      keyboard handler; that is PrimeVue's own upstream default, not something this app broke.
      Overriding the two slots HERE, in the app-owned wrapper every password field already goes
      through, makes every password field's toggle keyboard-accessible and labelled without
      touching the generated Volt file.
    -->
    <template #maskicon="{ toggleCallback }">
      <span
        :aria-label="t('common.password.hide')"
        class="absolute end-3 top-1/2 -mt-2 flex size-4 cursor-pointer items-center justify-center text-surface-500 dark:text-surface-400"
        role="button"
        tabindex="0"
        @click="toggleCallback()"
        @keydown.enter="toggleCallback()"
        @keydown.space.prevent="toggleCallback()">
        <EyeSlashIcon class="h-4 w-4" />
      </span>
    </template>
    <template #unmaskicon="{ toggleCallback }">
      <span
        :aria-label="t('common.password.show')"
        class="absolute end-3 top-1/2 -mt-2 flex size-4 cursor-pointer items-center justify-center text-surface-500 dark:text-surface-400"
        role="button"
        tabindex="0"
        @click="toggleCallback()"
        @keydown.enter="toggleCallback()"
        @keydown.space.prevent="toggleCallback()">
        <EyeIcon class="h-4 w-4" />
      </span>
    </template>
  </Password>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import EyeIcon from '@primevue/icons/eye'
import EyeSlashIcon from '@primevue/icons/eyeslash'

const { t } = useI18n()
</script>

<style scoped>

</style>
