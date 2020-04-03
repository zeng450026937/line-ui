import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { createColorClasses } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-content');

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    color: String,
  },

  render(h, { props, data, slots }) {
    const { color } = props;
    return (
      <div class={[bem(), createColorClasses(color)]} {...data}>
        {slots()}
      </div>
    );
  },
});
