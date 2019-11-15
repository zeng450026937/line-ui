<template>
  <div :class="bem()"
       ref="refresher"
       @touchstart="onTouchstart"
       @touchmove="onTouchmove"
       @touchend="onTouchend"
       @touchcancel="onTouchend">
    <div :class="bem('content')"
         :style="style">
      <div :class="bem('pull-placeholder')">
        <span class="placeholder__down-text"
              v-show="down">
          <slot name="down-text">{{ downText }}</slot>
        </span>
        <span class="placeholder__up-text"
              v-show="up">
          <slot name="up-text">{{ upText }}</slot>
        </span>
        <span class="placeholder__refresher-text"
              v-show="refresher">
          <slot name="refresher-text">{{ refresherText }}</slot>
        </span>
        <span class="placeholder__refresher-text">
          <slot name=""></slot>
        </span>
      </div>
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('refresher');

export default {
  name : 'Refresher',

  components : {

  },

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
    bem() {
      return bem;
    },
    style() {
      const style = { transform: `translate3d(0, ${ this.top }px, 0)` };
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

  created() {

  },

  mounted() {

  },

  methods : {
    onTouchstart(event) {
      if (this.$refs.refresher.scrollTop > 0) {
        return;
      }

      this.startY = event.targetTouches[0].pageY;
      this.touching = true;
    },
    onTouchmove(event) {
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
    onTouchend(event) {
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
};
</script>

<style lang="scss" scoped>
.line-refresher {
  width: 100%;
  overflow: hidden;
  position: relative;
  &__content {
    transition: transform;
  }

  &__pull-placeholder {
    width: 100%;
    height: 50px;
    position: absolute;
    top: -50px;
    left: 0;
    overflow: hidden;
    color: #999999;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
