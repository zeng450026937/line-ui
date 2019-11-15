import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';

const [createComponent, bem] = createNamespace('popup');

export default createComponent({
  mixins : [usePopup({ bem })],

  methods : {
    onTap() {
      console.log('onTap');
      this.visable = !this.visable;
    },
  },

  render() {
    console.log(`${ this.overlayIndex }`);
    return (
      <div
        v-show={this.visable}
        class={bem()}
        style={{
          'z-index' : `${ this.overlayIndex }`,
        }}
      >
        <div class={bem('content')}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
