import Vue from 'vue';
import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { isDef } from '@/utils/helpers';
import { Icon } from '@/components/icon';
import ripple from '@/directives/ripple';
import '@/components/item/item.scss';
import '@/components/item/item.ios.scss';

const [createComponent, bem] = createNamespace('item');

export type CssClassMap = { [className: string]: boolean };

export default createComponent({
  mixins : [useColor()],

  directives : { ripple },

  provide(): any {
    return {
      Item : this,
    };
  },

  props : {
    button   : Boolean,
    // Boolean property has default false value
    detail   : { type: Boolean, default: undefined },
    disabled : Boolean,
    ripple   : Boolean,
    download : String,
    href     : String,
    rel      : String,
    target   : String,
    // 'full' | 'inset' | 'none' | undefined;
    lines    : String,
  },

  data() {
    return {
      itemStyles     : {} as { [tagName: string]: CssClassMap },
      multipleInputs : false,
      hasCover       : false,
    };
  },

  computed : {
    isClickable(): boolean {
      return isDef(this.href) || this.button;
    },

    canActivate(): boolean {
      return this.isClickable || this.hasCover;
    },
  },

  methods : {
    itemStyle(tagName: string, cssclass: CssClassMap) {
      const { itemStyles } = this;
      const updatedStyles = cssclass;
      const newStyles = {} as any;
      const childStyles = itemStyles[tagName] || {};

      let hasStyleChange = false;
      Object.keys(updatedStyles).forEach(key => {
        if (updatedStyles[key]) {
          const itemKey = `item-${ key }`;
          if (!childStyles[itemKey]) {
            hasStyleChange = true;
          }
          newStyles[itemKey] = true;
        }
      });
      if (!hasStyleChange && Object.keys(newStyles).length !== Object.keys(childStyles).length) {
        hasStyleChange = true;
      }
      if (hasStyleChange) {
        Vue.set(itemStyles, tagName, newStyles);
      }
    },
  },

  mounted() {
    // The following elements have a clickable cover that is relative to the entire item
    const covers = this.$el.querySelectorAll('.line-checkbox, .line-datetime, .line-select, .line-radio');

    // The following elements can accept focus alongside the previous elements
    // therefore if these elements are also a child of item, we don't want the
    // input cover on top of those interfering with their clicks
    const inputs = this.$el.querySelectorAll('.line-input, .line-range, .line-searchbar, .line-segment, .line-textarea, .line-toggle');

    // The following elements should also stay clickable when an input with cover is present
    const clickables = this.$el.querySelectorAll('.line-anchor, .line-button, a, button');

    // Check for multiple inputs to change the position of the input cover to relative
    // for all of the covered inputs above
    this.multipleInputs = (covers.length + inputs.length > 1)
      || (covers.length + clickables.length > 1)
      || (covers.length > 0 && this.isClickable);

    this.hasCover = covers.length === 1 && !this.multipleInputs;
  },

  render() {
    const {
      mode, itemStyles,
      disabled, ripple, detail, href, download, rel, target, lines,
      isClickable: clickable, canActivate,
    } = this;
    const childStyles = {};

    const TagType = clickable ? (isDef(href) ? 'a' : 'button') : 'div' as any;

    const attrs = (TagType === 'button')
      ? { type: this.type }
      : {
        download,
        href,
        rel,
        target,
      };

    const showDetail = isDef(detail) ? detail : mode === 'ios' && clickable;

    Object.keys(itemStyles).forEach(key => {
      Object.assign(childStyles, itemStyles[key]);
    });

    return (
      <div
        aria-disabled={disabled ? 'true' : null}
        class={[
          bem({

          }),
          {
            ...childStyles,
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

            {showDetail && <Icon class="item-detail-icon" name="chevron_right"></Icon>}

            <div class="item-inner-highlight"></div>
          </div>
        </TagType>
      </div>
    );
  },
});
