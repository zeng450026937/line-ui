import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { createColorClasses } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('toolbar');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    color : String,
  },

  render(h, { props, data, slots }) {
    const { color } = props;
    return (
      <div
        class={[bem(), createColorClasses(color)]}
        {...data}
      >
        <div class={bem('background')}></div>

        <div class={bem('container')}>
          {slots('start')}
          {slots('secondary')}

          <div class={bem('content')}>
            {slots()}
          </div>

          {slots('primary')}
          {slots('end')}
        </div>
      </div>
    );
  },
});
