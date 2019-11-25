import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup-next';
import { Overlay } from '@/components/overlay';
import '@/components/popup/popup.scss';

const [createComponent, bem] = createNamespace('popup');
const OVERLAY_ELEMENT = 'overlay';
const CONTENT_ELEMENT = 'content';

export default createComponent({
  mixins : [usePopup()],

  props : {
    // center | top | bottom | left | right
    position : {
      type    : String,
      default : 'center',
    },
  },

  methods : {
    onOverlayTap() {
      this.$emit('overlay:tap');
    },
  },

  render() {
    return (
      <div
        v-show={this.visible}
        aria-modal="true"
        role="dialog"
        class={bem()}
      >
        <Overlay
          ref={OVERLAY_ELEMENT}
          onTap={this.onOverlayTap}
        >
        </Overlay>

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
