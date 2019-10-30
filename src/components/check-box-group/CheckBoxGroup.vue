<template>
  <div class="check-box-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { createGroup } from '@/components/group';

export default Vue.extend({
  name: 'CheckBoxGroup',

  extends: createGroup('CheckBoxGroup'),

  props: {

  },

  computed: {

  },

  methods: {

  },
});
</script>

<style lang="scss">
</style>
