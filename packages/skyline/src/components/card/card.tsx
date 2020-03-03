import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { isDef } from 'skyline/utils/helpers';
import ripple from 'skyline/directives/ripple';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  directives : { ripple },

  props : {
    button   : Boolean,
    // 'submit' | 'reset' | 'button' = 'button';
    type     : String,
    disabled : Boolean,
    download : String,
    href     : String,
    rel      : String,
    ripple   : Boolean,
    target   : String,
  },

  computed : {
    clickable(): boolean {
      return (this.href !== undefined || this.button);
    },
  },

  render() {
    const {
      mode, disabled, clickable,
      type, href, download, rel, target,
    } = this;

    const TagType = clickable ? (isDef(href) ? 'a' : 'button') : 'div' as any;
    const attrs = (TagType === 'button')
      ? { type }
      : {
        download,
        href,
        rel,
        target,
      };

    return (
      <div
        class={[
          bem(),
          {
            'card-disabled'    : disabled,
            'line-activatable' : clickable,
          },
        ]}
        on={this.$listeners}
      >
        {
          !clickable ? this.slots() : (
            <TagType
              {...{ attrs }}
              vRipple={clickable && (ripple || mode === 'md')}
              class="card-native"
              disabled={disabled}
            >
              {this.slots()}
            </TagType>
          )
        }
      </div>
    );
  },
});
