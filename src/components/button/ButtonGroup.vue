<template>
  <div class="button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { useGroup } from '@/components/group';

const NAMESPACE = 'ButtonGroup';

export default Vue.extend({
  name : 'ButtonGroup',

  extends : useGroup(NAMESPACE),

  // render(h) {

  // },
});
</script>

<style lang="scss">
.button-group {
  display: flex;
  // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  .button {
    border-radius: 0;
    box-shadow: none;
    &:active {
      box-shadow: none;
    }
    &::after {
      border-radius: 0;
    }
  }

  .button + .button {
    margin-left: 1px;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      position: absolute;
      left: -1px;
      top: 0px;
      background-color: #fff;
    }
  }
  .button.is--circle:nth-of-type(1) {
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    &::after {
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }
  }
  .button.is--circle:nth-last-of-type(1) {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    &::after {
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
    }
  }
  .button:nth-of-type(1) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    &::after {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
  .button:nth-last-of-type(1) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    &::after {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
