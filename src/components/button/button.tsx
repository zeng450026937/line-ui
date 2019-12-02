import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useMode } from '@/mixins/use-mode';
import { useColor } from '@/mixins/use-color';
import { isDef } from '@/utils/helpers';
import ripple from '@/directives/ripple';
import '@/components/button/button.scss';
import '@/components/button/button.ios.scss';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button');

export default createComponent({
  mixins : [useMode(), useColor(), useGroupItem(NAMESPACE)],

  directives : { ripple },

  props : {
    text      : String,
    vertical  : Boolean,
    disabled  : Boolean,
    activated : Boolean,
    focused   : Boolean,
    // full | block
    expand    : String,
    // clear | outline | solid
    fill      : String,
    // round | circle
    shape     : String,
    // small | large
    size      : String,
    // 'submit' | 'reset' | 'button' = 'button';
    type      : String,
    download  : String,
    href      : String,
    rel       : String,
    strong    : Boolean,
    target    : String,
    // override default
    checkable : {
      type    : Boolean,
      default : false,
    },
  },

  render() {
    const {
      type, download, href, rel, target, text,
    } = this;
    const {
      disabled, strong, shape, expand, fill = 'solid', size, vertical,
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

    return (
      <div
        {...{ attrs }}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : null}
        class={[
          'activatable',
          'ion-focusable',
          bem({
            [expand] : isDef(expand),
            [size]   : isDef(size),
            [shape]  : isDef(shape),
            [fill]   : true,
            strong,
            disabled,
          }),
        ]}
      >
        <TagType v-ripple class={bem('content', { vertical })}>
          {this.slots('start')}
          {this.slots() || text}
          {this.slots('end')}
        </TagType>
      </div>
    );
  },
});
