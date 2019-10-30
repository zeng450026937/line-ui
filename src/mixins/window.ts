import Vue from 'vue';

const Window = Vue.extend({
  props: {
    title: {
      type: String,
    },
  },

  methods: {
    alert(msg: string) {
      if (!msg) return;

      if (window) {
        /* eslint-disable no-alert */
        window.alert(msg);
        /* eslint-enable no-alert */
      }
    },
    async close() {
      const closeEvent = {
        accepted: true,
      };

      this.$emit('closing', closeEvent);

      if (!closeEvent.accepted) return;

      await this.$nextTick();

      // is it ok?
      this.$destroy();
    },
    hide() {

    },
    lower() {

    },
    raise() {

    },
    requestActivate() {

    },
    show() {
      this.showNormal();
    },
    showFullScreen() {

    },
    showMaximized() {

    },
    showMinimized() {

    },
    showNormal() {

    },
  },

  created() {
    if (!document) return;

    if (this.title) {
      document.title = this.title;
    }
  },
});

export default Window;
