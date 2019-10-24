import Vue from 'vue';
import debounce from 'lodash.debounce';

// Cross-browser support as described in:
// https://stackoverflow.com/questions/1248081
function getClientWidth() {
  if (typeof document === 'undefined') return 0; // SSR

  return Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0,
  );
}

function getClientHeight() {
  if (typeof document === 'undefined') return 0; // SSR
  
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
  );
}

export default Vue.extend({
  data() {
    return {
      clientWidth: getClientWidth(),
      clientHeight: getClientHeight(),

      thresholds: {
        xs: 600,
        sm: 960,
        md: 1280,
        lg: 1920,
      },
      scrollbarWidth: 16,
    };
  },

  computed: {
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
        width: this.clientWidth,
        height: this.clientHeight,
        thresholds: this.thresholds,
        scrollbarWidth: this.scrollbarWidth,
      };
    },
  },

  methods: {
    onResize: debounce(function onResize() {
      this.setDimensions();
    }, 200),

    setDimensions() {
      this.clientHeight = getClientHeight();
      this.clientWidth = getClientWidth();
    },
  },

  created() {
    if (!window) return;

    window.addEventListener('resize', this.onResize, { passive: true });
  },

  beforeDestroy() {
    if (!window) return;

    window.removeEventListener('resize', this.onResize);
  },
});
