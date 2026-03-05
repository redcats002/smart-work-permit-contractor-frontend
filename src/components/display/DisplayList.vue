<template>
  <div class="w-full grid grid-cols-1 gap-2.5">
    <div
      v-for="(item, i) in items"
      :key="`item-${item.key}-${i}`"
      class="grid grid-cols-3 gap-2.5">
      <div class="text-sm font-bold text-gray-500">
        <slot
          v-if="$slots[`label.${item.key}`]"
          :label="item.label"
          :name="`label.${item.key}`"
          :value="item.value" />
        <span v-else>{{ item.label }}</span>
      </div>
      <div class="text-sm col-span-2 flex items-center gap-2.5">
        <span v-if="!item?.hideColon">:</span>
        <slot
          v-if="$slots[`value.${item.key}`]"
          :label="item.label"
          :name="`value.${item.key}`"
          :value="item.value" />
        <template v-else>
          <span
            v-if="item?.extUrl"
            class="text-blue-500! underline! cursor-pointer"
            @click="go(item?.extUrl)">
            {{ item?.value }}
          </span>
          <span v-else>{{ item?.value }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface IDisplayList {
  key: string
  label: string
  value: any
  encrypt?: boolean
  hideColon?: boolean
  extUrl?: string
}

interface IProps {
  items?: IDisplayList[]
}

withDefaults(defineProps<IProps>(), {
  items: (): IDisplayList[] => []
})

function go (url: string): void {
  window.open(url, '_blank')
}
</script>

<style scoped></style>
