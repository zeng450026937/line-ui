import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { useTrigger } from '@line-ui/line/src/mixins/use-trigger';
import { useModel } from '@line-ui/line/src/mixins/use-model';
import { useCollapseTransition } from '@line-ui/line/src/mixins/use-collapse-transiton';
import { useClickOutside } from '@line-ui/line/src/mixins/use-click-outside';
import { Animation } from '@line-ui/line/src/utils/animation';
import { createPopper } from '@line-ui/line/src/utils/popper';
import { popupContext } from '@line-ui/line/src/utils/popup';
import ComboBoxItem from '@line-ui/line/src/components/combo-box/combo-box-item';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('combo-box');

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ useModel('visible'),
    /*#__PURE__*/ useColor(),
    /*#__PURE__*/ useTrigger(),
    /*#__PURE__*/ useClickOutside(),
    /*#__PURE__*/ useCollapseTransition(),
  ],

  props: {
    options: Array,
    showDuration: Number,
    hideDuration: Number,
    expand: Boolean,
    size: String,
  },

  data() {
    return {
      placement: 'bottom',
    };
  },

  methods: {
    close() {
      this.$emit('change', false);
    },

    createPopper() {
      if (this.popper) return;

      const getBoundingClientRect = () =>
        this.$triggerEl.getBoundingClientRect();
      const $trigger = { getBoundingClientRect };
      const { $el, placement } = this as any;
      const offset = 2;

      this.popper = createPopper($trigger, $el, {
        placement,
        strategy: 'fixed',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, offset],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              mainAxis: false,
              altAxis: true, // false by default
              padding: offset,
            },
          },
          {
            name: 'flip',
            options: {
              padding: offset,
            },
          },
        ],
      });
    },
  },

  beforeMount() {
    this.$on('aboutToShow', (baseEl: HTMLElement) => {
      if (this.expand && this.$triggerEl) {
        const { width } = this.$triggerEl.getBoundingClientRect();

        baseEl.style.width = `${width}px`;
      }

      this.createPopper();
      this.popper.update();

      popupContext.push(this as any);
    });

    this.$on(
      'animation-enter',
      async (baseEl: HTMLElement, animation: Animation) => {
        const { showDuration = 200 } = this;

        await this.$nextTick();

        // update zIndex
        baseEl.style.zIndex = `${popupContext.getOverlayIndex()}`;

        animation
          .easing('ease')
          .duration(showDuration)
          .fromTo('opacity', '0', '1');
      }
    );

    this.$on('animation-leave', (baseEl: HTMLElement, animation: Animation) => {
      const { hideDuration = 150 } = this;

      animation.easing('ease').duration(hideDuration);
    });

    this.$on('closed', () => {
      popupContext.pop(this as any);
    });

    this.$on('canceled', () => {
      popupContext.pop(this as any);
    });

    this.$on('event-include', (include: Function) => {
      return include(this.$triggerEl);
    });

    const onClickOutside = () => {
      this.close();
    };
    this.$on('clickoutside', onClickOutside);
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
    }
    // TODO
    // if (this.vHover) {
    //   this.vHover.unbind();
    // }
  },

  render() {
    const { visible, options } = this;

    return (
      <div class={bem()} vShow={visible} on={this.$listeners}>
        <ul class={bem('content')}>
          {this.slots() ||
            options.map((option: any) => (
              <ComboBoxItem option={option}>{option.text}</ComboBoxItem>
            ))}
        </ul>
      </div>
    );
  },
});
