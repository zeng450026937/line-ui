import { createNamespace } from 'skyline/src/utils/namespace';

import { useColor } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('item-option');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  props : {
    disabled   : Boolean,
    download   : String,
    expandable : {
      type    : Boolean,
      default : false,
    },
    href   : String,
    rel    : String,
    target : String,
    type   : {
      type    : String,
      default : 'button',
    },
  },

  methods : {
    onClick(ev: Event) {
      const el = (ev.target as HTMLElement).closest('.line-item-option');
      console.log(el);
      if (el) {
        ev.preventDefault();
      }
    },
  },

  render() {
    const {
      disabled, expandable, href, mode, type, download, target,
    } = this;
    const TagType = href === undefined ? 'button' : 'a' as any;
    const attrs = (TagType === 'button')
      ? { type }
      : {
        download,
        href,
        target,
      };

    return (
      <div
        class={[
          bem({
            disabled,
            expandable,
          }),
          {
            'line-activatable' : true,
          },
        ]}
        onClick={this.onClick}
      >
        <TagType
          {...attrs}
          class={bem('button-native')}
          disabled={disabled}
        >
          <span class={bem('button-inner')}>
            {this.slots('top')}
            <div class="horizontal-wrapper">
              {this.slots('start')}
              {this.slots('icon-only')}
              {this.slots()}
              {this.slots('end')}
            </div>
            {this.slots('bottom')}
          </span>
          {mode === 'md' && <line-ripple-effect></line-ripple-effect>}
        </TagType>
      </div>
    );
  },
});
