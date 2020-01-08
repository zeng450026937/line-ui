import { createNamespace } from '@/utils/namespace';
import '@/components/refresher/refresher.scss';

const [createComponent, bem] = createNamespace('refresher');

export default createComponent({
  props : {
    downText : {
      type    : String,
      default : '下拉刷新',
    },
    upText : {
      type    : String,
      default : '释放即可刷新',
    },
    refresherText : {
      type    : String,
      default : '加载中...',
    },
    value : {
      type    : Boolean,
      default : false,
    },
    heightOffset : {
      type    : Number,
      default : 50,
    },
  },

  data() {
    return {
      state    : 0,
      startY   : 0,
      touching : false,
      top      : 0,
    };
  },

  computed : {
    style() {
      const style = {
        transform             : `translate3d(0, ${ this.top }px, 0)`,
        'transition-duration' : '',
      };
      if (!this.touching) {
        style['transition-duration'] = '300ms';
      }

      return style;
    },
    down() {
      return this.state === 0;
    },
    up() {
      return this.state === 1;
    },
    refresher() {
      return this.state === 2;
    },
  },

  methods : {
    onTouchstart(event: TouchEvent) {
      if ((this.$refs.refresher as Element).scrollTop > 0) {
        return;
      }

      this.startY = event.targetTouches[0].pageY;
      this.touching = true;
    },
    onTouchmove(event: TouchEvent) {
      if (!this.touching) {
        return;
      }
      const { startY, state, heightOffset } = this;
      const diffValue = event.targetTouches[0].pageY - startY;
      if (diffValue > 0) {
        event.preventDefault();
      }
      this.top = Math.round(diffValue ** 0.8) + (state === 2 ? heightOffset : 0);

      if (this.state === 2) {
        return;
      }
      if (this.top >= heightOffset) {
        this.state = 1;
      } else {
        this.state = 0;
      }
    },
    onTouchend(event: TouchEvent) {
      this.touching = false;
      const { state, heightOffset } = this;
      if (state === 2) {
        this.state = 2;
        this.top = heightOffset;
        return;
      }
      if (this.top >= heightOffset) {
        this.$emit('input', true);
        this.$nextTick(() => {
          this.$emit('refresh');
        });
      } else {
        this.state = 0;
        this.top = 0;
      }
    },
  },

  watch : {
    value(val) {
      const { state, heightOffset, touching } = this;
      if (val) {
        this.state = 2;
        this.top = heightOffset;
      } else if (touching) {
        if (this.top >= heightOffset) {
          this.state = 1;
        } else {
          this.state = 0;
        }
      } else {
        this.top = 0;
        this.state = 0;
      }
    },
  },

  render() {
    const {
      style, downText, upText, refresherText, down, up, refresher,
    } = this;

    return (
      <div
        class={bem()}
        ref='refresher'
        on={{
          '!touchstart'  : this.onTouchstart,
          '!touchmove'   : this.onTouchmove,
          '!touchend'    : this.onTouchend,
          '!touchcancel' : this.onTouchend,
        }}
      >
        <div
          class={bem('content')}
          style={style}
        >
          <div
            class={bem('pull-placeholder')}
          >
            {down && (
              <span
                class='placeholder__down-text'
              >
                {this.slots('down-text') || downText}
              </span>
            )}
            {up && (
              <span
                class='placeholder__up-text'
              >
                {this.slots('up-text') || upText}
              </span>
            )}
            {refresher && (
              <span
                class='placeholder__refresher-text'
              >
                {this.slots('refresher-text') || refresherText}
              </span>
            )}
            <span
              class='placeholder__refresher-text'
            ></span>
          </div>
          {this.slots()}
        </div>
      </div>
    );
  },
});
