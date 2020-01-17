import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/card/card.scss';
import '@/components/card/card.ios.scss';
import { isDef } from '@/utils/helpers';
import ripple from '@/directives/ripple';

const [createComponent, bem] = createNamespace('card');

export default createComponent({
  mixins : [useColor()],

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
