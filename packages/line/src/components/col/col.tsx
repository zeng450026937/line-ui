import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { matchBreakpoint } from '@line-ui/line/src/utils/media';
import { isSupportsVars } from '@line-ui/line/src/utils/dom';

const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

const { createComponent, bem } = /*#__PURE__*/ createNamespace('col');

export default /*#__PURE__*/ createComponent({
  props: {
    offset: String,
    offsetXs: String,
    offsetSm: String,
    offsetMd: String,
    offsetLg: String,
    offsetXl: String,

    pull: String,
    pullXs: String,
    pullSm: String,
    pullMd: String,
    pullLg: String,
    pullXl: String,

    push: String,
    pushXs: String,
    pushSm: String,
    pushMd: String,
    pushLg: String,
    pushXl: String,

    size: String,
    sizeXs: String,
    sizeSm: String,
    sizeMd: String,
    sizeLg: String,
    sizeXl: String,
  },

  mounted() {
    window.addEventListener('resize', this.onResize, { passive: true });
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    onResize() {
      this.$forceUpdate();
    },

    // Loop through all of the breakpoints to see if the media query
    // matches and grab the column value from the relevant prop if so
    getColumns(property: string) {
      let matched;

      for (const breakpoint of BREAKPOINTS) {
        const matches = matchBreakpoint(breakpoint);

        // Grab the value of the property, if it exists and our
        // media query matches we return the value
        const columns = (this as any)[
          property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)
        ];

        if (matches && columns !== undefined) {
          matched = columns;
        }
      }

      // Return the last matched columns since the breakpoints
      // increase in size and we want to return the largest match
      return matched;
    },

    calculateSize() {
      const columns = this.getColumns('size');

      // If size wasn't set for any breakpoint
      // or if the user set the size without a value
      // it means we need to stick with the default and return
      // e.g. <line-col size-md>
      if (!columns || columns === '') {
        return;
      }

      // If the size is set to auto then don't calculate a size
      const colSize =
        columns === 'auto'
          ? 'auto'
          : // If CSS supports variables we should use the grid columns var
          isSupportsVars()
          ? `calc(calc(${columns} / var(--line-grid-columns, 12)) * 100%)`
          : // Convert the columns to a percentage by dividing by the total number
            // of columns (12) and then multiplying by 100
            `${(columns / 12) * 100}%`;

      /* eslint-disable-next-line consistent-return */
      return {
        flex: `0 0 ${colSize}`,
        width: `${colSize}`,
        'max-width': `${colSize}`,
      };
    },

    // Called by push, pull, and offset since they use the same calculations
    calculatePosition(property: string, modifier: string) {
      const columns = this.getColumns(property);

      if (!columns) {
        return;
      }

      // If the number of columns passed are greater than 0 and less than
      // 12 we can position the column, else default to auto
      const amount = isSupportsVars()
        ? // If CSS supports variables we should use the grid columns var
          `calc(calc(${columns} / var(--line-grid-columns, 12)) * 100%)`
        : // Convert the columns to a percentage by dividing by the total number
        // of columns (12) and then multiplying by 100
        columns > 0 && columns < 12
        ? `${(columns / 12) * 100}%`
        : 'auto';

      /* eslint-disable-next-line consistent-return */
      return {
        [modifier]: amount,
      };
    },

    calculateOffset(isRTL: boolean) {
      return this.calculatePosition(
        'offset',
        isRTL ? 'margin-right' : 'margin-left'
      );
    },

    calculatePull(isRTL: boolean) {
      return this.calculatePosition('pull', isRTL ? 'left' : 'right');
    },

    calculatePush(isRTL: boolean) {
      return this.calculatePosition('push', isRTL ? 'right' : 'left');
    },
  },

  render() {
    const isRTL = document.dir === 'rtl';

    return (
      <div
        class={bem()}
        style={{
          ...this.calculateOffset(isRTL),
          ...this.calculatePull(isRTL),
          ...this.calculatePush(isRTL),
          ...this.calculateSize(),
        }}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
