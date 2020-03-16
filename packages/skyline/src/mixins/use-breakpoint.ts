import { createMixins } from 'skyline/src/utils/mixins';
import {
  getClientHeight,
  getClientWidth,
  hasWindow,
  off,
  on,
} from 'skyline/src/utils/dom';
import { debounce } from 'skyline/src/utils/helpers';

export function useBreakPoint() {
  return createMixins({
    data() {
      return {
        clientWidth  : getClientWidth(),
        clientHeight : getClientHeight(),

        thresholds : {
          xs : 600,
          sm : 960,
          md : 1280,
          lg : 1920,
        },
        scrollbarWidth : 16,
      };
    },

    computed : {
      breakpoint() {
        const xs = this.clientWidth < this.thresholds.xs;
        const sm = this.clientWidth < this.thresholds.sm && !xs;
        const md = this.clientWidth < (this.thresholds.md - this.scrollbarWidth) && !(sm || xs);
        const lg = this.clientWidth < (this.thresholds.lg - this.scrollbarWidth) && !(md || sm || xs);
        const xl = this.clientWidth >= (this.thresholds.lg - this.scrollbarWidth);

        const xsOnly = xs;
        const smOnly = sm;
        const smAndDown = (xs || sm) && !(md || lg || xl);
        const smAndUp = !xs && (sm || md || lg || xl);
        const mdOnly = md;
        const mdAndDown = (xs || sm || md) && !(lg || xl);
        const mdAndUp = !(xs || sm) && (md || lg || xl);
        const lgOnly = lg;
        const lgAndDown = (xs || sm || md || lg) && !xl;
        const lgAndUp = !(xs || sm || md) && (lg || xl);
        const xlOnly = xl;

        let name;
        switch (true) {
          case (xs):
            name = 'xs';
            break;
          case (sm):
            name = 'sm';
            break;
          case (md):
            name = 'md';
            break;
          case (lg):
            name = 'lg';
            break;
          default:
            name = 'xl';
            break;
        }

        return {
        // Definite breakpoint.
          xs,
          sm,
          md,
          lg,
          xl,

          // Useful e.g. to construct CSS class names dynamically.
          name,

          // Breakpoint ranges.
          xsOnly,
          smOnly,
          smAndDown,
          smAndUp,
          mdOnly,
          mdAndDown,
          mdAndUp,
          lgOnly,
          lgAndDown,
          lgAndUp,
          xlOnly,

          // For custom breakpoint logic.
          width          : this.clientWidth,
          height         : this.clientHeight,
          thresholds     : this.thresholds,
          scrollbarWidth : this.scrollbarWidth,
        };
      },
    },

    methods : {
      onResize : debounce(function onResize(this: any) {
        this.setDimensions();
      }, 200),

      setDimensions() {
        this.clientHeight = getClientHeight();
        this.clientWidth = getClientWidth();
      },
    },

    beforeMount() {
      if (!hasWindow) return;

      on(window, 'resize', this.onResize, { passive: true });
    },

    beforeDestroy() {
      if (!hasWindow) return;

      off(window, 'resize', this.onResize);
    },
  });
}
