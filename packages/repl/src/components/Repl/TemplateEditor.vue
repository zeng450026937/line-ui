<template>
  <div class="template-editor" ref="container" v-dimension="onDimension"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useModel } from './use-model';

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 1000
): T {
  let prevTimer: number | null = null;
  return ((...args: any[]) => {
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    prevTimer = window.setTimeout(() => {
      fn(...args);
      prevTimer = null;
    }, delay);
  }) as any;
}

export default Vue.extend({
  mixins: [useModel('source')],

  mounted() {
    /* eslint-disable-next-line */
    __non_webpack_require__(['vs/editor/editor.main'], () => {
      const { monaco } = window;

      const template = this.source;

      const editor = monaco.editor.create(this.$refs.container, {
        value: template,
        language: 'html',
        theme: 'vs',
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        contextmenu: false,
        minimap: {
          enabled: false,
        },
      });

      editor.getModel()!.updateOptions({
        tabSize: 2,
      });

      // update compile output when input changes
      editor.onDidChangeModelContent(
        debounce(() => {
          this.source = editor.getValue();
        })
      );

      this.editor = editor;
    });
  },

  methods: {
    onDimension(): void {
      const { editor } = this;
      if (editor) {
        editor.layout();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.template-editor {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;
}
</style>
