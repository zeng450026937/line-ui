import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('action-sheet-group');


export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    cancel : Boolean,
  },

  render(h, { data, props, slots }) {
    const { cancel } = props;
    return (
      <div
        class={bem({ cancel })}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
