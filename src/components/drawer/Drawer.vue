<template>
  <popup v-model="visible"
         global
         modal
         dim
         tappable
         @tap="setVisible(false)">
    <div :class="bem({'top': position === 0,
                      'left': position === 1,
                      'right': position === 2,
                      'bottom': position === 3})">
      <slot name="default">
        test
      </slot>
    </div>
  </popup>
  <!-- <div :class="bem({'top': position === 0,
                    'left': position === 1,
                    'right': position === 2,
                    'bottom': position === 3})"
       v-show="visible"
       v-remote="global">
    <div class="overlay"
         :style="{opacity: !dim ? 0.32 : 0.01}"
         @touchstart.capture="onTouchStart"
         @click.capture="onMouseDown"
         @mousedown.capture="onMouseDown">
      <slot name="overlay"
            v-bind="{modal, dim}"></slot>
    </div>
    <div :class="bem('content')">
      <slot name="default"></slot>
    </div>
  </div> -->
</template>

<script>
import { createNamespace } from '@/utils/namespace';
import { Popup } from '@/components/popup';

const [createComponent, bem, t] = createNamespace('drawer');


export const Edge = {
  TopEdge    : 0,
  LeftEdge   : 1,
  RightEdge  : 2,
  BottomEdge : 3,
};

export default {
  name : 'Drawer',

  // extends : Popup,
  components : {
    Popup,
  },

  model : {
    prop  : 'value',
    event : 'change',
  },

  props : {
    dragMargin : {
      type    : Number,
      default : 0,
    },
    edge : {
      type    : Number,
      default : 0,
    },
    interactive : {
      type    : Boolean,
      default : true,
    },
    position : {
      type    : Number,
      default : 0,
    },
    value : {
      type    : [String, Boolean, Number],
      default : null,
    },
  },

  data() {
    return {
      visible : this.value,
    };
  },

  computed : {
    bem() {
      return bem;
    },
  },

  methods : {
    setVisible(value) {
      this.visible = value;
      this.$emit('change', value);
    },
  },

  watch : {
    value : {
      handler(val) {
        this.visible = val;
      },
      immediate : true,
    },
  },
};
</script>

<style lang="scss">
.line-drawer {
  padding: 10px;
  background-color: #ffffff;
  position: absolute;
  // border-radius: 4px;
  // position: fixed;
  // // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // // border: dotted plum;
  // transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
  // z-index: 9;

  // .overlay {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   border-radius: inherit;
  //   transition: inherit;
  //   background-color: rgba(0, 0, 0, 0.87);
  //   opacity: 0.32;
  // }
  // &__content {
  //   padding: 10px;
  //   background-color: #ffffff;
  //   position: absolute;
  //   border-radius: 4px;
  // }
}
.line-drawer--top {
  // .line-drawer__content {
  width: 100%;
  min-height: 68px;
  top: 0;
  left: 0;
  // }
}
.line-drawer--left {
  // .line-drawer__content {
  height: 100%;
  min-width: 68px;
  top: 0;
  left: 0;
  // }
}
.line-drawer--right {
  // .line-drawer__content {
  height: 100%;
  min-width: 68px;
  top: 0;
  right: 0;
  // }
}
.line-drawer--bottom {
  // .line-drawer__content {
  width: 100%;
  min-height: 68px;
  bottom: 0;
  left: 0;
  // }
}
</style>
