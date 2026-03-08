<template>
  <div
    class="
      relative
      w-full
      bg-white
      border border-[#E2E8F0] rounded-md
      px-4 py-6
      sm:p-3
      md:p-5
      lg:p-10
    ">
    <div
      v-if="$slots.topright"
      class="absolute mb-4 grid gap-2 right-4 top-4">
      <slot name="topright" />
    </div>
    <slot />
  </div>
</template>
