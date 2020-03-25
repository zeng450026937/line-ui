import { Icon } from 'skyline/src/components/icon';
import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('cell');

export default /*#__PURE__*/ createComponent({
  props : {
    title   : [String, Number],
    content : [String, Number],
    arrow   : Boolean,
  },

  render() {
    const {
      title = '',
      content = '',
      arrow = false,
    } = this;

    return (
      <div
        class={bem({ arrow })}
        on={ this.$listeners }
      >
        <div class={bem('title')}>
          { this.slots('title') || title }
        </div>

        <div class={bem('content')}>
          { this.slots('content') || content }
          {
            arrow && (
              <span class={bem('arrow')} >
                <Icon
                  name='chevron_right'
                  width="24"
                  height="24"
                >
                </Icon>
              </span>
            )
          }
        </div>
      </div>
    );
  },

});
