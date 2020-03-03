import * as m from 'monaco-editor';

declare global {
  interface Window {
    Vue: Vue;
    monaco: typeof m;
    init: () => void;
  }
}

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

  const output = document.getElementById('output')!;

  let lastComponent: Vue | undefined;

  function reCompile() {
    const src = editor.getValue();
    if (lastComponent) {
      lastComponent.$destroy();
    }
    lastComponent = createComponent(src);
  }

  function createComponent(template: string) {
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

function debounce<T extends(...args: any[]) => any>(
  fn: T,
  delay: number = 500): T {
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
