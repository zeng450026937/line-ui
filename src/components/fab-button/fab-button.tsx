import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { useGroupItem } from '@/mixins/use-group-item';
import { isDef } from '@/utils/helpers';
import ripple from '@/directives/ripple';
import '@/components/fab-button/fab-button.scss';
import '@/components/fab-button/fab-button.ios.scss';

const NAMESPACE = 'FabGroup';
const [createComponent, bem] = createNamespace('fab-button');

export default createComponent({
  mixins : [useColor(), useGroupItem(NAMESPACE)],

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

    const inList = this.inParentGroup;
    return (
      <div
        {...{ attrs }}
        aria-disabled={disabled ? 'true' : null}
        class={[
          'activatable',
          'ion-focusable',
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
      >
        <TagType
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
