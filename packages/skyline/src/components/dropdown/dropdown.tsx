import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { useTrigger } from 'skyline/src/mixins/use-trigger';
import { useClickOutside } from 'skyline/src/mixins/use-click-outside';
import { iosEnterAnimation } from 'skyline/src/components/tooltip/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/tooltip/animations/ios.leave';
import { createPopper } from 'skyline/src/utils/popper';
import DropdownItem from 'skyline/src/components/dropdown/dropdown-item';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('dropdown');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
    /*#__PURE__*/ usePopup({ disableScroll: false }),
    /*#__PURE__*/ useTrigger(),
    /*#__PURE__*/ useClickOutside({
      includes(this: any) {
        return [this.$triggerEl].filter(Boolean);
      },
    }),
  ],

  props : {
    options : {
      type    : Array,
      default : () => [],
    },
    offset : {
      type    : Array,
      default : () => [0, 0],
    },
    placement : {
      type    : String,
      default : 'bottom',
    },
  },

  beforeMount() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = (baseEl: HTMLElement) => {
        const {
          $triggerEl = (this.event && this.event.target) || document.body,
          $el,
          placement,
          offset,
        } = this;

        this.popper = this.popper || createPopper(
          $triggerEl,
          $el as HTMLElement,
          {
            placement : placement as any,
            strategy  : 'fixed',
            modifiers : [
              // {
              //   name    : 'preventOverflow',
              //   options : {
              //     mainAxis : false, // true by default
              //   },
              // },
              {
                name    : 'offset',
                options : {
                  offset,
                },
              },
              {
                name    : 'flip',
                options : {
                  rootBoundary : 'body',
                  // fallbackPlacements : ['top'],
                },
              },

            ],
          },
        );

        return iosEnterAnimation(baseEl);
      };
    });

    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
    });
  },

  async mounted() {
    window.addEventListener('resize', () => {
      this.popper && this.popper.update();
    });
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
    }
  },

  render() {
    const { visible, options } = this;

    return (
      <div
        vShow={visible}
        class={bem()}
        on={this.$listeners}
      >
        <ul class={bem('content')}>
          {
            this.slots() || options.map((option: any) => (
              <DropdownItem option={option}>
                {option.text}
              </DropdownItem>
            ))
          }
        </ul>
      </div>
    );
  },
});
