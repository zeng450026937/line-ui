<template>
  <div class="message" :class="kind">
    <template v-if="detail">
      <div>{{ detail }}</div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    detail: [String, Object, Error],
    kind: {
      type: String,
      default: 'info',
    },
  },
});
</script>

<style lang="scss" scoped>
.message {
  position: relative;

  margin: 0;

  padding: 14px 14px 14px 44px;

  border-top: 1px solid white;

  color: white;
}

.message::before {
  position: absolute;
  top: 14px;
  left: 14px;

  width: 10px;
  height: 10px;

  padding: 4px;

  border: 2px solid white;
  border-radius: 50%;

  color: white;

  font-size: 11px;
  font-weight: 700;

  line-height: 1;

  text-align: center;

  box-sizing: content-box;
  // prettier-ignore
  content: "!";
}

.truncate {
  text-overflow: ellipsis;

  white-space: pre;
  overflow-x: hidden;
}

.error {
  background-color: #eb445a;
}

.warning {
  background-color: #ffc409;
}

.info {
  background-color: #3dc2ff;
}
</style>
