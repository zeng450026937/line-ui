import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { useGroupItem } from '@line-ui/line/src/mixins/use-group-item';
import { isDef } from '@line-ui/line/src/utils/helpers';
import ripple from '@line-ui/line/src/directives/ripple';

const NAMESPACE = 'ButtonGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('button');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useColor(), /*#__PURE__*/ useGroupItem(NAMESPACE)],

  directives: { ripple },

  props: {
    text: String,
    strong: Boolean,
    disabled: Boolean,
    ripple: Boolean,
    // display in vertical mode, default horizontal
    vertical: Boolean,
    // full | block
    expand: String,
    // clear | outline | solid
    fill: String,
    // round | circle
    shape: String,
    // small | large
    size: String,
    // 'submit' | 'reset' | 'button' = 'button';
    type: String,
    download: String,
    href: String,
    rel: String,
    target: String,
    checkable: Boolean,
  },

  data() {
    return {
      inToolbar: false,
      inListHeader: false,
      inItem: false,
    };
  },

  mounted() {
    this.inToolbar = !!this.$el.closest('.line-toolbar');
    this.inListHeader = !!this.$el.closest('.line-list-header');
    this.inItem =
      !!this.$el.closest('.line-item') ||
      !!this.$el.closest('.line-item-divider');
  },

  render() {
    const {
      text,
      strong,
      disabled,
      ripple,
      vertical,
      expand,
      fill,
      shape,
      size,
      type = 'button',
      download,
      href,
      rel,
      target,
      inItem,
      inToolbar,
      inListHeader,
    } = this;
    const finalSize = !isDef(size) && inItem ? 'small' : size;
    const finalFill =
      !isDef(fill) && (inToolbar || inListHeader) ? 'clear' : fill || 'solid';
    const TagType = isDef(href) ? 'a' : ('button' as any);
    const attrs =
      TagType === 'button'
        ? { type }
        : {
            download,
            href,
            rel,
            target,
          };

    return (
      <div
        disabled={disabled}
        aria-disabled={disabled ? 'true' : null}
        class={[
          'line-activatable',
          'line-focusable',
          bem({
            [expand]: isDef(expand),
            [finalSize]: isDef(finalSize),
            [shape]: isDef(shape),
            [finalFill]: true,
            strong,
            vertical,
            disabled,
          }),
        ]}
        on={this.$listeners}
      >
        <TagType
          {...{ attrs }}
          vRipple={ripple}
          disabled={disabled}
          class={bem('content')}
        >
          {this.slots('icon-only')}

          {this.slots('start')}

          {this.slots('indicator')}

          {this.slots() || text}

          {this.slots('end')}
        </TagType>
      </div>
    );
  },
});
