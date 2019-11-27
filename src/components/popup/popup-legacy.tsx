import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import '@/components/popup/popup.scss';

const [createComponent, bem] = createNamespace('popup');
const CONTENT_ELEMENT = 'content';

export default createComponent({
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
