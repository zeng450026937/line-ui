import Vue from 'vue';

const Window = Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
  },

  methods: {
    alert(msg) {
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

    document.title = this.title;
  },
});

export default Window;
