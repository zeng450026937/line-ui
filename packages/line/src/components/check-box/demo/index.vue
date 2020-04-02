<template>
  <div>
    <line-check-box v-model="checkValue" :indeterminate="false" color="danger">test</line-check-box>
    <line-check-box v-model="checkValue" :indeterminate="false" color="success">test</line-check-box>
    <line-check-box-group>
      <line-check-box v-model="checkValue">test</line-check-box>
    </line-check-box-group>
    <line-cell>
      <template slot="title">
         test
      </template>
      <line-check-box slot="content" v-model="checkValue"></line-check-box>
    </line-cell>
  </div>
</template>

<script>
import {
  CheckBox as LineCheckBox, CheckBoxGroup as LineCheckBoxGroup, CheckIndicator as LineCheckIndicator,
} from '@line-ui/skyline/src/components/check-box';
import { Cell as LineCell } from '@line-ui/skyline/src/components/cell';

export default {
  name : 'CheckBoxDemo',

  components : {
    LineCheckBox,
    LineCheckBoxGroup,
    LineCell,
  },

  props : {

  },

  data() {
    return {
      checkValue : false,
    };
  },

  computed : {

  },

  created() {

  },

  mounted() {

  },

  methods : {

  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
</style>
