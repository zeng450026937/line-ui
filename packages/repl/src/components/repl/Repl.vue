<template>
  <div class="container">
    <SplitPane type="horizontal">
      <template #start>
        <TemplateEditor></TemplateEditor>
      </template>
    </SplitPane>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SplitPane from './SplitPane.vue';
import TemplateEditor from './TemplateEditor.vue';

export default Vue.extend({
  components: { SplitPane, TemplateEditor },

  created() {
    /* eslint-disable-next-line */
    __non_webpack_require__(['vs/editor/editor.main'], () => {
      this.loading = false;
    });
  },

  data() {
    return {
      loading: true,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  width: 100%;
  height: 100%;
}
</style>
