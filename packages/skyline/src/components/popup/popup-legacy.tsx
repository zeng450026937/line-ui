import { createNamespace } from 'skyline/utils/namespace';
import { usePopup } from 'skyline/mixins/use-popup';

const [createComponent, bem] = createNamespace('popup');
const CONTENT_ELEMENT = 'content';

export default /*#__PURE__*/ createComponent({
  mixins : [usePopup()],

  render() {
    return (
      <div
        v-show={this.visible}
        aria-modal="true"
        role="dialog"
        class={bem()}
      >
        <div
          role="dialog"
          class={bem(CONTENT_ELEMENT)}
          ref={CONTENT_ELEMENT}
        >
          {this.slots()}
        </div>
      </div>
    );
  },
});
