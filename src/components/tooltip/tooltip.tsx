import Popper from 'popper.js';
import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { useLazy } from '@/mixins/use-lazy';
import { useModel } from '@/mixins/use-model';
import { useTrigger } from '@/mixins/use-trigger';
import { useTransition } from '@/mixins/use-transition';
import { isDef } from '@/utils/helpers';
import '@/components/tooltip/tooltip.scss';

const [createComponent, bem] = createNamespace('tooltip');

export type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export default createComponent({
  mixins : [
    useColor(),
    useLazy(),
    useModel('visible'),
    useTrigger(),
    useTransition(),
  ],

  props : {
    // This property holds the text shown on the tool tip.
    text  : String,
    // This property holds the delay (milliseconds) after which the tool tip is shown.
    // A tooltip with a negative delay is shown immediately.
    // The default value is 0.
    delay : {
      type    : Number,
      default : 0,
    },
    // This property holds the timeout (milliseconds) after which the tool tip is hidden.
    // A tooltip with a negative timeout does not hide automatically.
    // The default value is -1.
    timeout : {
      type    : Number,
      default : -1,
    },
    placement : {
      type    : String,
      default : 'top',
    },
  },

  watch : {
    async visible(val) {
      this.clear();

      if (!val) return;

      const { delay } = this;

      this.delayTimer = setTimeout(this.show, delay);
    },
  },

  beforeMount() {
    this.visible = this.visible || (
      isDef(this.$attrs.visible)
        && (this.$attrs.visible as string | boolean) !== false
    );
  },

  mounted() {
    if (this.visible) {
      this.show();
    }
  },

  updated() {
    if (this.popper) {
      this.popper.scheduleUpdate();
    }
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
    }
    this.clear();
  },

  methods : {
    clear() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (this.disappearTimer) {
        clearTimeout(this.disappearTimer);
        this.disappearTimer = null;
      }
      this.popper = null;
    },
    hide() {
      this.clear();
      this.visible = false;
    },
    show(text?: string, timeout: number = -1, delay: number = 0) {
      this.clear();
      this.visible = true;

      const {
        $triggerEl = document.body,
        $el,
        placement,
      } = this;

      text = text || this.text;
      timeout = timeout || this.timeout;
      delay = delay || this.delay;

      if (timeout > -1) {
        this.disappearTimer = setTimeout(() => this.visible = false, timeout);
      }

      this.popper = new Popper(
        $triggerEl,
        $el,
        {
          placement     : placement as any,
          positionFixed : true,
          eventsEnabled : false,
          modifiers     : {
            computeStyle : {
              // TODO
              // use gpuAcceleration will cause animation work failed
              // while don't use gpuAcceleration may impact scroll perf.
              gpuAcceleration : false,
            },
          },
        },
      );
    },
  },

  render() {
    const { visible } = this;
    return (
      <div vShow={visible} class={bem()}>
        <div class={bem('content')}>
          { this.slots() }
        </div>
      </div>
    );
  },
});
