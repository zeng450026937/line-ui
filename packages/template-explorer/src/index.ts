import * as m from 'monaco-editor';

declare global {
  interface Window {
    Vue: Vue;
    Skyline: any;
    monaco: typeof m;
    init: () => void;
  }
}

window.init = () => {
  const { monaco, Vue, Skyline } = window;

  const template = `
<line-app>
  <line-header>
    <line-title>Template Explorer</line-title>
  </line-header>

  <line-content>
    <line-button>
      Click Me
    </line-button>
  </line-content>

  <line-footer style="text-align: center">
    <p>Skyline Team</p>
    <p>©2019 Skyline Terms Privacy</p>
  </line-footer>
</line-app>
`.trim();

  const editor = monaco.editor.create(document.getElementById('source')!, {
    value                : template,
    language             : 'html',
    theme                : 'vs-dark',
    fontSize             : 14,
    wordWrap             : 'on',
    scrollBeyondLastLine : false,
    renderWhitespace     : 'selection',
    contextmenu          : false,
    minimap              : {
      enabled : false,
    },
  });

  editor.getModel()!.updateOptions({
    tabSize : 2,
  });

  // handle resize
  window.addEventListener('resize', () => {
    editor.layout();
  });

  // update compile output when input changes
  editor.onDidChangeModelContent(debounce(reCompile));

  editor.onDidChangeCursorPosition(debounce(e => {
    clearEditorDecos();
  }, 100));

  let previousEditorDecos: string[] = [];
  function clearEditorDecos() {
    previousEditorDecos = editor.deltaDecorations(previousEditorDecos, []);
  }

  const output = document.getElementById('output')!;

  const component = new Vue({
    template,
    mounted() {
      output.appendChild(this.$el);
    },
    beforeDestroy() {
      this.$el.remove();
    },
  }).$mount();

  function reCompile() {
    const src = editor.getValue();

    console.clear();
    const start = performance.now();
    const compiled = Vue.compile(src);
    console.log(`Compiled in ${ (performance.now() - start).toFixed(2) }ms.`);

    component.$options.render = compiled.render;
    component.$options.staticRenderFns = compiled.staticRenderFns;
    component._staticTrees = [];
    component.$forceUpdate();
  }

  new Vue({
    render(h) {
      return h('div', { domProps: { id: 'header' } }, [
        h('h1', 'Skyline Template Explorer'),
        h(
          'a',
          {
            domProps : {
              href   : `http://gitcode.yealink.com/server/client/web_app/skyline/tree/${ __COMMIT__ }`,
              target : '_blank',
            },
          },
          `@${ __COMMIT__ }`,
        ),

        h(
          'div',
          {
            domProps : {
              id : 'options-wrapper',
            },
          },
          [
            h('div', { domProps: { id: 'options-label' } }, `Skyline ${ __VERSION__ } ↘`),
          ],
        ),
      ]);
    },
  }).$mount('#header');
};

function debounce<T extends(...args: any[]) => any>(
  fn: T,
  delay: number = 1000): T {
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
