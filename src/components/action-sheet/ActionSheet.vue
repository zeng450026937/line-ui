<template>
  <popup v-model="visible"
         global
         modal
         dim
         tappable
         @tap="setVisible(false)">
    <div class="action-sheet">
      <slot name="default">
        test
      </slot>
    </div>
  </popup>
</template>

<script lang="js">
import Vue from 'vue';
import { Popup } from '@/components/popup';

export default Vue.extend({
  name: 'ActionSheet',

  components: {
    Popup,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: [String, Boolean, Number],
      default: null,
    },
    height: {
      type: [Number, String],
      default: 200,
    },
  },

  data() {
    return {
      visible: this.value,
    };
  },

  computed: {},

  methods: {
    setVisible(value) {
      this.visible = value;
      this.$emit('change', value);
    },
  },

  watch: {
    value(val) {
      this.visible = val;
    },
  },
});
</script>

<style lang="scss">
.action-sheet {
  width: 100%;
  min-height: 36px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
