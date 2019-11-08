<template>
  <div class="badge"
       :class="classes">
    <slot name="default"></slot>
    <span class="badge__content"
          v-show="visible"
          :style="badgeStyle">
      {{ badgeValue }}
      <!-- <slot name="default"></slot> -->
    </span>
  </div>
</template>

<script>
import Vue from 'vue';

const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];

export default Vue.extend({
  name : 'Badge',

  props : {
    color : {
      type    : String,
      default : 'danger', // primary, success, warning, danger, light, dark
    },
    value : {
      type    : Number,
      default : 0,
    },
    visible : {
      type    : Boolean,
      default : true,
    },
    dot : {
      type    : Boolean,
      default : false,
    },
    left : {
      type    : Boolean,
      default : false,
    },
    bottom : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    badgeValue() {
      const value = this.dot ? null : this.value;

      return value;
    },

    classes() {
      const classes = {
        'badge--left'   : this.left,
        'badge--bottom' : this.bottom,
        'badge--dot'    : this.dot,
      };
      if (colors.includes(this.color)) {
        classes[`badge--${ this.color }`] = true;
      }
      return classes;
    },

    badgeStyle() {
      const style = {};
      if (!colors.includes(this.color)) {
        style.backgroundColor = this.color;
      }

      return style;
    },
  },


  created() {

  },

  methods : {

  },

  watch : {

  },
});
</script>

<style lang="scss">
.badge {
  display: inline-block;
  position: relative;
  &__content {
    display: inline-flex;
    height: 20px;
    color: #fff;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    border-radius: 10px;
    background-color: #ed4014;
    padding: 0 8px;
    position: absolute;
    top: -9px;
    right: 0px;
    transform: translateX(50%);
  }
  &.badge--dot {
    .badge__content {
      height: 10px;
      width: 10px;
      padding: 0;
      top: -5px;
    }
  }

  // TODO
  /*
    &.badge--left {
      left: 0;
    }
    &.badge--bottom {
      bottom: 0;
    }
  */

  &.badge--primary {
    .badge__content {
      background-color: var(--primary);
    }
  }
  &.badge--success {
    .badge__content {
      background-color: var(--success);
    }
  }
  &.badge--warning {
    .badge__content {
      background-color: var(--warning);
    }
  }
  &.badge--danger {
    .badge__content {
      background-color: var(--danger);
    }
  }
  &.badge--light {
    .badge__content {
      background-color: var(--light);
      color: #1a1a1a;
    }
  }
  &.badge--dark {
    .badge__content {
      background-color: var(--dark);
      color: #ffffff;
    }
  }
}
</style>
