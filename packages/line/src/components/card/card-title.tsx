import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { createColorClasses } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-title');

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    color: String,
  },

  render(h, { props, data, slots }) {
    const { color } = props;
    return (
      <div
        role="heading"
        aria-level="2"
        class={[bem(), createColorClasses(color), 'line-inherit-color']}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
