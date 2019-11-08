<template functional>
  <div class="avatar">
    <slot></slot>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name : 'Avatar',

  functional : true,
});
</script>

<style lang="scss">

.avatar {
  align-items: center;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;

  width: 60px;
  height: 60px;
  background-color: lightblue;

  img,
  svg {
    border-radius: inherit;
    display: inline-flex;
    height: inherit;
    width: inherit;
  }
}

</style>
