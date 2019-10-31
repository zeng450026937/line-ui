<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
    close() {
      const closeEvent = {
        accepted: true,
      };
      this.$emit('closing', closeEvent);
      if (!closeEvent.accepted) return;
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
</script>
