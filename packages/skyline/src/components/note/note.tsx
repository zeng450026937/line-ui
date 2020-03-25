import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('note');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    color : String,
  },

  render(h, { props, data, slots }) {
    const { color } = props;
    return (
      <div
        class={[
          bem(),
          createColorClasses(color),
        ]}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
