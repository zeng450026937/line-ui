import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('action-sheet-title');


export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    header    : String,
    subHeader : String,
  },

  render(h, { data, props, slots }) {
    const { header, subHeader } = props;

    return (
        <div
          class={bem()}
          {...data}
        >
          {slots() || header}
          {
            slots('subHeader')
              ? <div class={bem('sub-title')}>
                  {slots('subHeader')}
                </div>
              : subHeader && (
                <div class={bem('sub-title')}>
                  {subHeader}
                </div>)
          }
        </div>
    );
  },
});
