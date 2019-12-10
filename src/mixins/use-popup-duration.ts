import { createMixins } from '@/utils/mixins';

export function usePopupDuration() {
  return createMixins({
    props : {
      // This property holds the timeout (milliseconds) after which the tool tip is hidden.
      // A tooltip with a negative timeout does not hide automatically.
      // The default value is -1.
      duration : Number,
    },

    created() {
      this.$on('opened', () => {
        if (this.duration > 0) {
          this.durationTimeout = setTimeout(() => this.close('timeout'), this.duration);
        }
      });
      this.$on('aboutToHide', () => {
        if (this.durationTimeout) {
          clearTimeout(this.durationTimeout);
        }
      });
    },
  });
}
