<template>
  <div class="repl">
    <SplitPane type="horizontal">
      <template #start>
        <section>
          <div class="repl-editor">
            <TemplateEditor v-model="source"></TemplateEditor>
            <Message v-if="error" :detail="error" kind="error"></Message>
          </div>
        </section>
      </template>

      <template #end>
        <section>
          <div class="repl-explorer">
            <TemplateExplorer :source="compiled"></TemplateExplorer>
          </div>
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
import Message from './Message.vue';
import { useModel } from './use-model';
import { parseComponent } from 'vue-template-compiler';

export default Vue.extend({
  components: { SplitPane, TemplateEditor, TemplateExplorer, Message },

  mixins: [useModel('source')],

  data() {
    return {
      source: '',
    };
  },

  computed: {
    sfc() {
      return parseComponent(this.source);
    },

    error() {
      return this.sfc.errors[0];
    },

    compiled() {
      const { sfc, error } = this;
      const { template, script, styles, errors } = sfc;
      const hasTemplate = template && template.content;
      if (!hasTemplate || error) {
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
          ${
            script
              ? script.content
                  .trim()
                  .replace(/export\s+default\s+/, 'return ')
                  .replace(/module.exports\s+=\s+/, 'return ')
              : ''
          }
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
});
</script>

<style lang="scss" scoped>
.repl {
  position: relative;

  width: 100%;
  height: 100%;

  section {
    position: relative;

    width: 100%;
    height: 100%;

    box-sizing: border-box;
  }

  .repl-editor,
  .repl-explorer {
    display: flex;

    flex-direction: column;

    width: 100%;
    height: 100%;
  }
}
</style>
