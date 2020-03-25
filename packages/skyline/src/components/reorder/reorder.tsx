import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('reorder');

export default /*#__PURE__*/ createComponent({
  data() {
    return {
      reorderIndex : -1,
    };
  },

  render() {
    const reorderIcon = 'menu';

    return (
      <div class={bem()}>
        {this.slots() || <line-icon class={bem('icon')} size="small" name={reorderIcon} lazy={false} />}
      </div>
    );
  },

});
