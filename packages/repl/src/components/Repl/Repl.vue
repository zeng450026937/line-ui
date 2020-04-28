<template>
  <div class="repl">
    <SplitPane type="horizontal">
      <template #start>
        <section>
          <TemplateEditor></TemplateEditor>
        </section>
      </template>

      <template #end>
        <section>
          <TemplateExplorer></TemplateExplorer>
        </section>
      </template>
    </SplitPane>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SplitPane from './SplitPane.vue';
import TemplateEditor from './TemplateEditor.vue';
import TemplateExplorer from './TemplateExplorer.vue';
import * as compiler from 'vue-template-compiler';

const templateRE = /(?<=<template>)[\s\S]+(?=<\/template>)/g;
const scriptRE = /(?<=<script>)[\s\S]+(?=<\/script>)/g;
const styleRE = /(?<=<style>)[\s\S]+(?=<\/style>)/g;

export default Vue.extend({
  components: { SplitPane, TemplateEditor, TemplateExplorer },

  data() {
    return {
      source: '',
    };
  },

  computed: {
    template() {
      const matched = this.source.match(templateRE);
      return matched && matched[0];
    },
    script() {
      const matched = this.source.match(scriptRE);
      return matched && matched[0];
    },
    style() {
      const matched = this.source.match(styleRE);
      return matched && matched[0];
    },

    sfc() {
      return compiler.parseComponent(this.source);
    },

    result() {
      const { template, script, styles } = this.sfc;
      if (!template) {
        return '';
      }
      return `
        let styles;

        styles = document.querySelectorAll('style[id^=repl-]');
				let i = styles.length;
        while (i--) styles[i].parentNode.removeChild(styles[i]);

        styles = [
          ${styles
            .map((style) => style.content && style.content.trim())
            .filter(Boolean)
            .map((content) => `\`${content}\``)
            .join(',')}
        ];
        styles.forEach((content, index) => {
          const style = document.createElement('style');
          style.id = \`repl-\${index}\`;
          style.textContent = content;
          document.head.appendChild(style);
        });

        if (window.component) {
					try {
						window.component.$destroy();
					} catch (err) {
						console.error(err);
					}
        }

				document.body.innerHTML = '';
        window.location.hash = '';
        
        const script = () => {
          ${script.content
            .trim()
            .replace(/export\s+default/, 'return')
            .replace(/module.exports\s+=/, 'return')}
        };

				window.component = new Vue({
          extends: {
            template: ${JSON.stringify(template.content.trim())},
            mounted() {
              document.body.appendChild(this.$el);
            },
          },
          ...script()
        });
        window.component.$mount();
      `;
    },
  },

  provide() {
    return {
      REPL: this,
    };
  },
});
</script>

<style lang="scss">
.repl {
  position: relative;

  width: 100%;
  height: 100%;

  section {
    position: relative;

    height: 100%;

    padding: 42px 0 0 0;
    box-sizing: border-box;
  }

  section > *:first-child {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 42px;
    box-sizing: border-box;
  }

  section > *:last-child {
    width: 100%;
    height: 100%;
  }
}
</style>
