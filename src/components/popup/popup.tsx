import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import '@/components/popup/popup.scss';

const [createComponent, bem] = createNamespace('popup');
const CONTENT_ELEMENT = 'content';

export default createComponent({
  mixins : [usePopup()],

  methods : {
    focous() {
      // focus content element or focusable element in content element
      // TBD
      (this.$refs[CONTENT_ELEMENT] as HTMLElement).focus();
    },

    onClick(e: Event) {
      console.log(e);
    },
  },

  render() {
    return (
      <div
        aria-modal="true"
        v-show={this.visable}
        class={bem()}
      >
        <div
          // role="dialog"
          class={bem(CONTENT_ELEMENT)}
          ref={CONTENT_ELEMENT}
          on={this.$listeners}
          onClick={this.onClick}
        >
          {this.slots()}
        </div>
      </div>
    );
  },
});
