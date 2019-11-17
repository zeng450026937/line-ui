import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';

const [createComponent, bem] = createNamespace('popup');
const CONTENT_ELEMENT = 'content';

export default createComponent({
  mixins : [usePopup()],

  methods : {
    focous() {
      // focus content element or focusable element in content element
      // TBD
    },
    onOverlayTap() {
      console.log('onTap');
      this.visable = !this.visable;
    },
  },

  render() {
    return (
      <div v-show={this.visable} class={bem()}>
        <div class={bem(CONTENT_ELEMENT)} ref={CONTENT_ELEMENT}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
