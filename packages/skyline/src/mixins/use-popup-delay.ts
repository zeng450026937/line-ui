import { createMixins } from 'skyline/src/utils/mixins';

export function usePopupDelay() {
  return createMixins({
    props : {
      // This property holds the delay (milliseconds) after which the tool tip is shown.
      // A tooltip with a negative delay is shown immediately.
      // The default value is 0.
      delay : {
        type    : Number,
        default : 0,
      },
    },

    data() {
      return {
        delayedVisible : this.visible,
      };
    },

    watch : {
      visible(val: boolean) {
        if (this.appearTimer) {
          clearTimeout(this.appearTimer);
        }

        if (val === this.delayedVisible) return;

        if (!val) {
          this.delayedVisible = val;
          return;
        }

        const delay = Math.max(this.delay, 0);

        this.appearTimer = setTimeout(() => this.delayedVisible = val, delay);
      },
    },
  });
}
