import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { isDef } from '@/utils/helpers';
import { Icon } from '@/components/icon';
import ripple from '@/directives/ripple';
// import '@/components/item/item.scss';
// import '@/components/item/item.ios.scss';

const [createComponent, bem] = createNamespace('item');

export default createComponent({
  mixins : [useColor()],

  props : {
    button   : Boolean,
    detail   : Boolean,
    disabled : Boolean,
    ripple   : Boolean,
    download : String,
    href     : String,
    rel      : String,
    target   : String,
    // 'full' | 'inset' | 'none' | undefined;
    lines    : String,
  },

  computed : {
    hasCover(): boolean {
      const inputs = this.el.querySelectorAll('.line-checkbox, .line-datetime, .line-select, .line-radio');
      return inputs.length === 1 && !this.multipleInputs;
    },

    isClickable(): boolean {
      return isDef(this.href) || this.button;
    },

    canActivate(): boolean {
      return this.isClickable || this.hasCover;
    },
  },

  render() {
    const {
      mode,
      disabled, detail, href, download, rel, target, lines,
      isClickable: clickable, canActivate,
    } = this;

    const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div' as any;

    const attrs = (TagType === 'button')
      ? { type: this.type }
      : {
        download,
        href,
        rel,
        target,
      };

    const showDetail = detail !== undefined ? detail : mode === 'ios' && clickable;

    return (
      <div
        aria-disabled={disabled ? 'true' : null}
        class={[
          bem({

          }),
          {
            item                      : true,
            [`item-lines-${ lines }`] : isDef(lines),
            'item-disabled'           : disabled,
            'line-activatable'        : canActivate,
            'line-focusable'          : true,
          },
        ]}
      >
        <TagType
          {...attrs}
          class="item-native"
          disabled={disabled}
          vRipple={ripple}
        >
          {this.slots('start')}

          <div class="item-inner">
            <div class="input-wrapper">
              {this.slots()}
            </div>

            {this.slots('end')}

            {showDetail && <Icon class="item-detail-icon" name="right"></Icon>}

            <div class="item-inner-highlight"></div>
          </div>
        </TagType>
      </div>
    );
  },
});
