<template>
  <div class="w-full grid grid-cols-1 gap-2.5">
    <template
      v-for="(item, i) in items"
      :key="`item-${String(item.key)}-${i}`">
      <div
        v-if="!item.hidden"
        :class="rowClass"
        class="grid gap-2.5">
        <div :class="['text-sm font-bold text-gray-500', labelClass]">
          <slot
            v-if="$slots[`label.${String(item.key)}`]"
            :label="item.label"
            :name="`label.${String(item.key)}`"
            :value="item.value" />
          <span v-else>{{ item.label }}</span>
        </div>
        <div :class="['text-sm flex items-center gap-2.5', valueClass]">
          <span v-if="!item?.hideColon">:</span>
          <slot
            v-if="$slots[`value.${String(item.key)}`]"
            :label="item.label"
            :name="`value.${String(item.key)}`"
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
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
export interface IDisplayList<T = any> {
  key: keyof T | (string & {})
  label: string
  value: any
  encrypt?: boolean
  hideColon?: boolean
  extUrl?: string
  hidden?: boolean
}

interface IProps<T = any> {
  items?: IDisplayList<T>[]
  rowClass?: string
  labelClass?: string
  valueClass?: string
}

withDefaults(defineProps<IProps>(), {
  items: (): IDisplayList[] => [],
  rowClass: 'grid-cols-2 md:grid-cols-3',
  labelClass: '',
  valueClass: 'md:col-span-2'
})

function go (url: string): void {
  window.open(url, '_blank')
}
</script>

<style scoped></style>
