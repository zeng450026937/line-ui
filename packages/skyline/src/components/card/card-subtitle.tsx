import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-subtitle');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    color : String,
  },

  render(h, { props, data, slots }) {
    const { color } = props;
    return (
      <div
        role="heading"
        aria-level="3"
        class={[
          bem(),
          createColorClasses(color),
          'line-inherit-color',
        ]}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
