import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { useGroupItem } from 'skyline/mixins/use-group-item';
import { isDef } from 'skyline/utils/helpers';
import ripple from 'skyline/directives/ripple';

const NAMESPACE = 'FabGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('fab-button');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
    /*#__PURE__*/ useGroupItem(NAMESPACE),
  ],

  directives : { ripple },

  props : {
    ripple      : Boolean,
    translucent : Boolean,
    text        : String,
    disabled    : Boolean,
    size        : String,
    // 'submit' | 'reset' | 'button' = 'button';
    type        : String,
    download    : String,
    href        : String,
    rel         : String,
    strong      : Boolean,
    target      : String,
  },

  render() {
    const {
      type = 'button', download, href, rel, target, text,
    } = this;
    const {
      disabled, checked, translucent, strong, size, vertical,
    } = this;
    const TagType = isDef(href) ? 'a' : 'button' as any;
    const attrs = (TagType === 'button')
      ? { type }
      : {
        download,
        href,
        rel,
        target,
      };

    const inList = this.itemInGroup;
    return (
      <div
        aria-disabled={disabled ? 'true' : null}
        class={[
          'activatable',
          'line-focusable',
          bem({
            [size]                : isDef(size),
            'in-list'             : inList,
            'translucent-in-list' : inList && translucent,
            'close-active'        : checked,
            strong,
            translucent,
            disabled,
          }),
        ]}
        on={this.$listeners}
      >
        <TagType
          {...{ attrs }}
          v-ripple={this.ripple}
          disabled={disabled}
          class={bem('content', { vertical })}
        >
          <span class={bem('indicator')}>
            {this.slots('indicator')}
          </span>
          <span class={bem('inner')}>
            {this.slots() || text}
          </span>
        </TagType>
      </div>
    );
  },
});
