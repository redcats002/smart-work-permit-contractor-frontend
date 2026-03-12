<template>
  <Suspense>
    <template #default>
      <keep-alive>
        <slot />
      </keep-alive>
    </template>
    <template #fallback>
      <div class="flex flex-col gap-4 p-5 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="h-9 w-48 bg-surface-200 rounded" />
          <div class="h-9 w-32 bg-surface-200 rounded" />
          <div class="ml-auto h-9 w-28 bg-surface-200 rounded" />
        </div>
        <div class="h-10 w-full bg-surface-200 rounded" />
        <div class="flex flex-col gap-2">
          <div
            v-for="n in 6"
            :key="n"
            class="h-12 w-full bg-surface-100 rounded" />
        </div>
      </div>
    </template>
  </Suspense>
</template>
