<template>
  <aside
    aria-hidden="true"
    class="auth-panel relative hidden overflow-hidden lg:block">
    <!-- Mesh gradient, drawn in CSS rather than shipped as an image. This app is first-party only
         (no CDN, no third-party runtime) and runs inside an industrial facility, so a decorative
         background must not cost a network fetch or a binary in the bundle. -->
    <div class="auth-panel__mesh absolute inset-0" />

    <!-- Scrim. Without it the copy's contrast depends on WHERE the mesh happens to be light: white
         clears AA against the panel base (>=9.8:1) but sits at 2.3-3.4:1 over the lightest stops,
         and a gradient has no single background colour for a contrast gate to check. The scrim
         gives the text a known floor regardless of what the mesh does behind it, which is the only
         version of this that can be asserted rather than eyeballed. -->
    <div class="auth-panel__scrim absolute inset-x-0 bottom-0 h-1/2" />

    <div class="relative flex h-full flex-col justify-end gap-3 p-10 xl:p-14">
      <p class="text-4xl leading-tight font-bold tracking-tight text-white xl:text-5xl">
        {{ t('platform.auth.welcome') }}
      </p>
      <p class="max-w-md text-sm leading-relaxed text-white/80">
        {{ t('platform.auth.welcomeBody') }}
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * The right half of the split sign-in screen. Decorative — `aria-hidden`, and hidden outright
 * below `lg`, where the form takes the full width rather than being squeezed beside a panel
 * nobody can read. Nothing here is interactive, so nothing is lost on a phone.
 *
 * Every colour comes from this app's own brand ramp, so the same component themes itself
 * differently in each app (wayfinder 058) without a prop or a branch.
 */
const { t } = useI18n()
</script>

<style scoped>
.auth-panel {
  background-color: var(--color-primary-900);
}

/*
 * Four overlapping radial gradients rather than a conic or an SVG: radial stops interpolate
 * smoothly on every engine we target, and the soft-blob look the design asks for is what
 * overlapping ellipses at low opacity produce. `background-blend-mode` keeps the overlaps from
 * flattening into a single muddy wash.
 */
.auth-panel__mesh {
  background-image:
    radial-gradient(60% 55% at 18% 20%, var(--color-primary-400) 0%, transparent 62%),
    radial-gradient(55% 45% at 82% 12%, var(--color-accent-300, var(--color-primary-200)) 0%, transparent 58%),
    radial-gradient(70% 60% at 72% 78%, var(--color-primary-600) 0%, transparent 66%),
    radial-gradient(90% 80% at 30% 92%, var(--color-primary-950) 0%, transparent 70%);
  background-blend-mode: screen, screen, normal, normal;
}

.auth-panel__scrim {
  background-image: linear-gradient(to top, var(--color-primary-950) 0%, transparent 100%);
}

/* The panel is decorative; a reader who asked for less motion is not asking for less colour, so
   there is nothing to disable here — it does not animate. Noted so nobody adds animation without
   adding the query too. */
</style>
