import { createNamespace } from 'skyline/src/utils/namespace';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { useTrigger } from 'skyline/src/mixins/use-trigger';
import { useClickOutside } from 'skyline/src/mixins/use-click-outside';
import { Overlay } from 'skyline/src/components/overlay';
import { PickerColumn as LinePickerColumn } from 'skyline/src/components/picker-column';
import { iosEnterAnimation } from 'skyline/src/components/dropdown-menu/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/dropdown-menu/animations/ios.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('dropdown-menu');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
    /*#__PURE__*/ useTrigger(),
    /*#__PURE__*/ useClickOutside({
      includes(this: any) {
        return [this.$triggerEl, this.$el].filter(Boolean);
      },
    }),
  ],

  props : {
    columns : {
      type    : Array,
      default : () => [],
    },
    height : {
      type    : Number,
      default : 260,
    },
  },

  data() {
    return {
      contentCSS : { top: 'auto', bottom: 'auto' },
      event      : null,
      top        : 'auto',
      bottom     : 'auto',
    };
  },

  beforeMount() {
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      animate(iosEnterAnimation(baseEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      animate(iosLeaveAnimation(baseEl));
    });
  },

  mounted() {
    if (this.trigger) {
      this.getContentStyle(this.trigger);
    }
  },


  methods : {
    onTap() {
      this.$emit('overlay-tap');
    },

    colChange(data: any) {
      this.$emit('colChange', data);
    },

    getContentStyle(trigger: HTMLElement | null) {
      const { $el, height } = this;

      if (!$el || !trigger) return;

      const contentHeight = height;


      const bodyHeight = ($el.ownerDocument as any).defaultView.innerHeight;

      // If ev was passed, use that for target element
      const targetDim = trigger.getBoundingClientRect();

      const targetTop = targetDim != null && 'top' in targetDim ? targetDim.top : bodyHeight / 2 - contentHeight / 2;
      const targetHeight = (targetDim && targetDim.height) || 0;

      const contentCSS: { top: string; bottom: string } = {
        top    : `${ targetTop + targetHeight }px`,
        bottom : 'auto',
      };

      this.top = contentCSS.top;
      this.bottom = 'auto';

      if (targetTop + targetHeight + contentHeight > bodyHeight && targetTop - contentHeight > 0) {
        this.bottom = contentCSS.bottom = `${ bodyHeight - (targetTop + targetHeight) + targetHeight }px`;
        this.top = 'auto';
      }

      this.contentCSS = contentCSS;
    },
  },

  watch : {
    trigger() {
      this.getContentStyle(this.trigger);
    },
  },

  render() {
    const {
      columns, visible, translucent, top, bottom, height,
    } = this;

    return (
      <div
        v-show={visible}
        aria-modal="true"
        ref="menu"
        class={bem({ translucent })}
        on={this.$listeners}
        style={{ top: top === 'auto' ? '' : top, bottom: bottom === 'auto' ? '' : bottom }}
      >
        <Overlay
          visible={this.dim}
          onTap={this.onTap}
        >
        </Overlay>

        <div
          class={bem('wrapper')}
          ref="wrapperEl"
        >
          <div
            class={bem('content')}
            ref="contentEl"
            style={{
              top    : top === 'auto' ? '' : `${ 0 }px`,
              bottom : bottom === 'auto' ? '' : `${ 0 }px`,
              height : `${ height }px`,
            }}
          >
            {this.slots() || (
              <div class="picker-columns">
                <div class="picker-above-highlight"></div>
                {columns.map((c: any) => (
                  <LinePickerColumn
                    onColChange={this.colChange}
                    col={c}
                  >
                  </LinePickerColumn>))}
                <div class="picker-below-highlight"></div>
              </div>)
            }
          </div>
        </div>
      </div>
    );
  },
});
