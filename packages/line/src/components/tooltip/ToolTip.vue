<template>
  <div class="tool-tip"
       ref="reference"
       v-remote="false">
    <span class="tool-tip__content"
          v-show="visible"
          ref="content">
      {{ text }}
    </span>
    <span @mouseenter="onMouseenter"
          @touchStart="onMouseenter"
          @mouseleave="onMouseleave"
          @touchEnd="onMouseleave">
      <slot name="default"></slot>
    </span>
  </div>
</template>

<script>
import Popper, { Placement } from 'popper.js';
import { Popup } from '@line-ui/skyline/src/components/popup';

export { Placement };

export default {
  name : 'ToolTip',

  extends : Popup,

  model : {
    prop  : 'value',
    event : 'change',
  },

  props : {
    delay : {
      type    : Number,
      default : 0,
    },
    text : {
      type    : String,
      default : '',
    },
    timeout : {
      type    : Number,
      default : 0,
    },
    value : {
      type    : Boolean,
      default : false,
    },
    placement : {
      type    : String,
      default : 'top',
    },
  },

  provide() {
    return {
      ToolTip : {
        delay   : this.delay,
        text    : this.text,
        timeout : this.timeout,
        toolTip : this,
        visible : this.visible,
      },
    };
  },

  data() {
    return {
      visible : this.value,
    };
  },

  created() {
    this.$emit('accepted');
    this.$emit('applied');
    this.$emit('discarded');
    this.$emit('helpRequested');
    this.$emit('rejected');
    this.$emit('reset');
  },

  mounted() {

  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  },

  methods : {
    hide() { },
    show() { },
    onMouseenter() {
      const { reference, content } = this.$refs;
      this.visible = true;
      this.popper = new Popper(reference, content, {
        placement     : this.placement,
        eventsEnabled : false,
        modifiers     : {
          flip            : { enabled: true },
          preventOverflow : {
            enabled             : true,
            escapeWithReference : false,
          },
        },
      });
    },
    onMouseleave() {
      this.visible = false;
    },
  },
  watch : {
    visible(val) {
      this.$emit('change', val);
    },
  },

};
</script>

<style lang="scss">
.tool-tip {
  position: relative;
  &__content {
    height: 32px;
    color: #ffffff;
    background-color: var(--dark);
    font-size: 14px;
    border-radius: 4px;
    padding: 0 20px;
    margin: 10px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    line-height: 1.2;
  }
}
</style>
