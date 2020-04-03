import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { Side } from '@line-ui/line/src/types';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('item-options');

const isEndSide = (side: Side): boolean => {
  const isRTL = document.dir === 'rtl';
  switch (side) {
    case 'start':
      return isRTL;
    case 'end':
      return !isRTL;
    default:
      throw new Error(
        `"${side}" is not a valid value for [side]. Use "start" or "end" instead.`
      );
  }
};

export default /*#__PURE__*/ createComponent({
  inject: {
    ItemSliding: { default: undefined },
  },

  props: {
    side: {
      type: String,
      default: 'end',
    },
  },

  methods: {
    fireSwipeEvent() {
      this.$emit('swipe', {
        side: this.side,
      });
    },
  },

  beforeMount() {
    if (this.ItemSliding) {
      this.ItemSliding.options.push(this);
    }
  },

  render() {
    const { mode, side } = this;
    const isEnd = isEndSide(side as Side);

    return (
      <div
        class={bem({
          [mode]: true,
          start: !isEnd,
          end: isEnd,
        })}
      >
        {this.slots()}
      </div>
    );
  },
});
