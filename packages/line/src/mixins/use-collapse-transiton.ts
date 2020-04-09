import { createMixins } from '@line-ui/line/src/utils/mixins';
import { useTransition } from '@line-ui/line/src/mixins/use-transition';
import { Animation } from '@line-ui/line/src/utils/animation';
import { config } from '@line-ui/line/src/utils/config';
import { enterAnimation } from '@line-ui/line/src/utils/collapse-animations/enter';
import { leaveAnimation } from '@line-ui/line/src/utils/collapse-animations/leave';
import { NOOP } from '@line-ui/line/src/utils/helpers';

export function useCollapseTransition() {
  return createMixins({
    mixins: [
      // Popup lifecycle events depend on Transition mechanism
      // Transition should not be disabled
      useTransition(),
    ],

    beforeMount() {
      const onBeforeEnter = async (el: HTMLElement) => {
        this.overflow = el.style.overflow;
        this.paddingTop = el.style.paddingTop;
        this.paddingBottom = el.style.paddingBottom;

        el.style.height = '0px';
        el.style.paddingTop = '0px';
        el.style.paddingBottom = '0px';
        el.style.overflow = 'hidden';

        this.$emit('aboutToShow', el);
      };
      const onAfterEnter = (el: HTMLElement) => {
        el.style.height = '';
        el.style.paddingTop = '';
        el.style.paddingBottom = '';
        el.style.animationTimingFunction = '';
        el.style.animationFillMode = '';
        el.style.animationDirection = '';
        el.style.animationIterationCount = '';
        el.style.animationName = '';

        el.style.overflow = this.overflow;

        this.$emit('opened');
      };

      const onBeforeLeave = (el: HTMLElement) => {
        this.overflow = el.style.overflow;
        this.paddingTop = el.style.paddingTop;
        this.paddingBottom = el.style.paddingBottom;

        el.style.height = `${el.scrollHeight}px`;
        el.style.overflow = 'hidden';

        this.$emit('aboutToHide', el);
      };
      const onAfterLeave = (el: HTMLElement) => {
        el.style.height = '';
        el.style.paddingTop = '';
        el.style.paddingBottom = '';
        el.style.animationTimingFunction = '';
        el.style.animationFillMode = '';
        el.style.animationDirection = '';
        el.style.animationIterationCount = '';
        el.style.animationName = '';

        el.style.overflow = this.overflow;
        el.style.paddingTop = this.paddingTop;
        el.style.paddingBottom = this.paddingBottom;

        this.$emit('closed');
      };

      const onEnter = async (el: HTMLElement, done: Function) => {
        await this.$nextTick();

        this.animation = enterAnimation(
          el,
          this.paddingTop,
          this.paddingBottom
        );

        if (!config.getBoolean('animated', true)) {
          this.animation.duration(0);
        }

        this.$emit('animation-enter', el, this.animation);

        await (this.animation as Animation)
          .play()
          .catch(__DEV__ ? (e) => console.error(e) : NOOP);

        done();
      };

      const onLeave = async (el: HTMLElement, done: Function) => {
        await this.$nextTick();

        this.animation = leaveAnimation(
          el,
          this.paddingTop,
          this.paddingBottom
        );

        if (!config.getBoolean('animated', true)) {
          this.animation.duration(0);
        }

        this.$emit('animation-leave', el, this.animation);

        await (this.animation as Animation)
          .play()
          .catch(__DEV__ ? (e) => console.error(e) : NOOP);

        done();
      };

      const onCancel = () => {
        if (this.animation) {
          this.animation.stop();
          this.animation = null;
        }

        this.$emit('canceled');
      };

      this.$on('before-enter', onBeforeEnter);
      this.$on('after-enter', onAfterEnter);

      this.$on('before-leave', onBeforeLeave);
      this.$on('after-leave', onAfterLeave);

      this.$on('enter', onEnter);
      this.$on('enter-cancelled', onCancel);
      this.$on('leave', onLeave);
      this.$on('leave-cancelled', onCancel);
    },
  });
}
