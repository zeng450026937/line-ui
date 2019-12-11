import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { useGroupItem } from '@/mixins/use-group-item';
import { isDef } from '@/utils/helpers';
import ripple from '@/directives/ripple';
import '@/components/button/button.scss';
import '@/components/button/button.ios.scss';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button');

export const ButtonDelegate = createComponent({
  functional : true,

  props : {
    text     : String,
    strong   : Boolean,
    disabled : Boolean,
    ripple   : Boolean,
    // display in vertical mode, default horizontal
    vertical : Boolean,
    // full | block
    expand   : String,
    // clear | outline | solid
    fill     : String,
    // round | circle
    shape    : String,
    // small | large
    size     : String,
    // 'submit' | 'reset' | 'button' = 'button';
    type     : String,
    download : String,
    href     : String,
    rel      : String,
    target   : String,
  },

  render(h, { props, slots }) {
    const {
      text, strong, disabled, ripple, vertical, expand, fill = 'solid', shape, size,
      type = 'button', download, href, rel, target,
    } = props;
    const TagType = isDef(href) ? 'a' : 'button' as any;
    const attrs = (TagType === 'button')
      ? { type }
      : {
        download, href, rel, target,
      };
    return (
      <div
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
        <TagType
          {...{ attrs }}
          vRipple={ripple}
          disabled={disabled}
          class={bem('content', { vertical })}
        >
          {slots('indicator')}
          {slots() || text}
        </TagType>
      </div>
    );
  },
});

export default createComponent({
  mixins : [useColor(), useGroupItem(NAMESPACE)],

  directives : { ripple },

  props : {
    ...ButtonDelegate.props,
    // override default
    checkable : {
      type    : Boolean,
      default : false,
    },
  },

  render() {
    return (
      <ButtonDelegate
        {...{ attrs: this.$attrs, props: this.$props }}
        scopedSlots={this.$scopedSlots}
      >
        {this.slots()}
      </ButtonDelegate>
    );
  },
});
