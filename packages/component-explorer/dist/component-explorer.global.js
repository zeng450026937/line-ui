(function () {
  'use strict';

  window.init = () => {
      const { monaco } = window;
      const template = `
<line-app>
  <line-content>
    <line-button>
      Click Me
    </line-button>
  </line-content>
</line-app>
`.trim();
      const editor = monaco.editor.create(document.getElementById('source'), {
          value: template,
          language: 'html',
          theme: 'vs-dark',
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          contextmenu: false,
          minimap: {
              enabled: false,
          },
      });
      editor.getModel().updateOptions({
          tabSize: 2,
      });
      // handle resize
      window.addEventListener('resize', () => {
          editor.layout();
      });
      // update compile output when input changes
      editor.onDidChangeModelContent(debounce(reCompile));
      const output = document.getElementById('output');
      let lastComponent;
      function reCompile() {
          const src = editor.getValue();
          if (lastComponent) {
              lastComponent.$destroy();
          }
          lastComponent = createComponent(src);
      }
      function createComponent(template) {
          return new window.Vue({
              template,
              mounted() {
                  output.appendChild(this.$el);
              },
              beforeDestroy() {
                  this.$el.remove();
              },
          }).$mount();
      }
      reCompile();
  };
  function debounce(fn, delay = 500) {
      let prevTimer = null;
      return ((...args) => {
          if (prevTimer) {
              clearTimeout(prevTimer);
          }
          prevTimer = window.setTimeout(() => {
              fn(...args);
              prevTimer = null;
          }, delay);
      });
  }

}());
