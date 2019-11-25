import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';

const [createComponent, bem] = createNamespace('toast');

export default createComponent({
  mixins : [usePopup()],

  props : {
    color : String,

    duration : Number,
    /**
     * The position of the toast on the screen.
     */
    // top | bottom | middle
    position : String,

    enterAnimation : Object,
    leaveAnimation : Object,
    animated       : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    return (
      <div
        v-show={this.visible}
        class={bem()}
      >
        <div
          class={bem('wrapper')}
        >
          <div
            class={bem('container')}
          >
            {}

            <div
              class={bem('content')}
            >
              <div class={bem('message')}>
                {this.message}
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
