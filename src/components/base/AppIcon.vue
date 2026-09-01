<template>
  <Icon
    v-if="registeredIcon"
    v-bind="$attrs"
    :icon="(props.icon as string)" />
  <svg
    v-else-if="props.icon"
    v-bind="$attrs"
    :aria-label="`missing icon: ${props.icon}`"
    fill="none"
    height="1em"
    role="img"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    viewBox="0 0 16 16"
    width="1em"><circle
      cx="8"
      cy="8"
      r="6.5" /><path d="M8 11.25v-.75c0-.9.6-1.35 1.2-1.8.5-.37.8-.83.8-1.45A2 2 0 0 0 8 5.25a2 2 0 0 0-2 2" /><circle
        cx="8"
        cy="12.75"
        fill="currentColor"
        r="0.1"
        stroke="none" /></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { Icon } from '@iconify/vue/offline'
import { REGISTERED_ICON_NAMES } from '@/plugins/Icon.plugin'

/**
 * wayfinder ticket 041 — thin wrapper around `@iconify/vue/offline`'s `Icon`, the single call
 * site every `import { Icon } from '@iconify/vue'` in this repo was rewritten to import instead.
 * Every template usage (`<Icon :icon="..." />`) is untouched — only the import line changed at
 * each of the ~26 call sites — because this wrapper keeps the same `icon` prop name/shape and
 * forwards everything else ($attrs: color, class, width, …) straight through.
 *
 * Three states:
 *  - `icon` falsy → render nothing. Several call sites (e.g. `BaseChip.vue`'s `appendIcon`,
 *    `PrintButton.vue`'s `icon`) pass an unguarded empty-string default today and rely on the
 *    Iconify component rendering nothing for it — a placeholder here would be a visible
 *    appearance change this ticket does not ask for.
 *  - `icon` truthy and registered (checked against `REGISTERED_ICON_NAMES`, a plain Set this
 *    repo tracks itself — the offline build exports no `iconLoaded`/lookup helper) → render the
 *    real icon.
 *  - `icon` truthy and NOT registered → a loud, specific `console.error` naming the icon, plus a
 *    small visible inline-SVG placeholder (same hand-drawn `currentColor` glyph house style as
 *    `PermitStatusGlyph.vue`) so a missing icon is never silently blank.
 */
interface IProps {
  icon?: string
}

const props = defineProps<IProps>()

defineOptions({ inheritAttrs: false })

const registeredIcon: ComputedRef<boolean> = computed((): boolean => {
  if (!props.icon) return false
  const isRegistered = REGISTERED_ICON_NAMES.has(props.icon)
  if (!isRegistered) {
    console.error(`AppIcon: icon "${props.icon}" is not registered — add it to scripts/icons/allowlist.mjs`)
  }
  return isRegistered
})
</script>

<style scoped>

</style>
