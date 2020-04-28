<template>
  <div class="template-editor" v-dimension="onDimension">
    <div class="editor">
      <div id="monaco-editor"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

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
  inject: ['REPL'],

  created() {
    /* eslint-disable-next-line */
    __non_webpack_require__(['vs/editor/editor.main'], () => {
      const { monaco } = window;

      /* eslint-disable no-useless-escape */
      const template = `
<template>
  <line-app></line-app>
</template>

<script>
<\/script>

<style>
</style>
      `.trim();
      /* eslint-enable no-useless-escape */
      const editor = monaco.editor.create(
        document.getElementById('monaco-editor')!,
        {
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
        }
      );

      editor.getModel()!.updateOptions({
        tabSize: 2,
      });

      // handle resize
      window.addEventListener('resize', () => {
        editor.layout();
      });

      // update compile output when input changes
      editor.onDidChangeModelContent(
        debounce(() => {
          this.REPL.source = editor.getValue();
        })
      );

      this.editor = editor;
      this.REPL.source = template;
    });
  },

  methods: {
    onDimension() {
      this.editor && this.editor.layout();
    },
  },
});
</script>

<style lang="scss">
.template-editor {
  display: flex;

  flex-direction: column;

  background: var(--back-light);

  z-index: 5;

  .editor {
    flex: 1 1 auto;

    height: 0;
  }

  #monaco-editor {
    position: relative;

    width: 100%;
    height: 100%;

    border: none;

    line-height: 1.5;

    overflow: hidden;
  }
}
</style>
