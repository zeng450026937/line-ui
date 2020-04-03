import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('dialog');
const CONTENT_ELEMENT = 'content';

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ usePopup()],

  render() {
    return (
      <div v-show={this.visible} class={bem()}>
        <div class={bem(CONTENT_ELEMENT)} ref={CONTENT_ELEMENT}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
