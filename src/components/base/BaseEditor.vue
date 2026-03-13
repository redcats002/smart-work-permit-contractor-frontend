<template>
  <Editor
    v-model="model"
    :editor-style="editorStyle"
    :pt="theme"
    :pt-options="{ mergeProps: ptViewMerge }"
    unstyled>
    <template #toolbar>
      <span class="ql-formats">
        <select class="ql-header" />
        <select class="ql-font" />
      </span>

      <span class="ql-formats">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
      </span>

      <span class="ql-formats">
        <button
          class="ql-list"
          value="ordered" />
        <button
          class="ql-list"
          value="bullet" />
      </span>

      <span class="ql-formats">
        <button class="ql-link" />
        <button class="ql-image" />
        <button class="ql-code-block" />
      </span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Editor from 'primevue/editor'
import type { EditorPassThroughOptions } from 'primevue/editor'
import { ptViewMerge } from '@/volt/utils'
import 'quill/dist/quill.snow.css'

interface Props {
  modelValue?: string
  editorStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  editorStyle: 'height:120px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed<string>({
  get (): string {
    return props.modelValue
  },
  set (val: string): void {
    emit('update:modelValue', val)
  }
})

const theme = ref<EditorPassThroughOptions>({
  root: 'flex flex-col border border-surface-200 rounded-lg overflow-hidden',

  toolbar: `
    border-b
    border-surface-200
    px-2
    py-1
    flex
    gap-1
  `,

  content: `
    px-3
    py-2
    text-sm
    min-h-[100px]
    focus:outline-none
  `
})
</script>

<style>
.ql-toolbar {
  border: none !important;
}

.ql-container {
  border: none !important;
}

.ql-editor {
  padding: 0;
  min-height: 100px;
  font-size: 14px;
}
</style>
