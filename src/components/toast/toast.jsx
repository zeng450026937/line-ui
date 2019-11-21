import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';

const [createComponent, bem] = createNamespace('toast');
const CONTENT_ELEMENT = 'content';

export default createComponent({
  mixins : [usePopup()],

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
