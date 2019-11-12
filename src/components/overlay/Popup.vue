<template>
  <div :class="bem({
    'dim': this.dim,
    'modal': this.modal
  })"
    v-show="visable"
  >
    <line-overlay
      :visable="dim"
      :tappable="tappable"
      @tap="onTap"
    ></line-overlay>
    <div :class="bem('content')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Overlay from './Overlay.vue';
import { createNamespace } from '@/utils/namespace';
import { useModel } from '@/mixins/use-model';

Vue.use(Overlay);

const [createComponent] = createNamespace('popup');

export default createComponent({
  mixins : [useModel('visable')],

  props : {
    global : {
      type    : Boolean,
      default : false,
    },
    closePolicy : {
      type    : Number,
      default : 0,
    },
    dim : {
      type    : Boolean,
      default : false,
    },
    modal : {
      type    : Boolean,
      default : false,
    },
    tappable : {
      type    : Boolean,
      default : true,
    },
  },

  methods : {
    onTap() {
      console.log('onTap');
      this.visable = !this.visable;
    },
  },
});

</script>

<style lang="scss">

.line {
  &-popup {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    align-items: center;
    justify-content: center;

    &__content {
      display: flex;
      position: absolute;

      flex-direction: column;
    }
  }
}

</style>
