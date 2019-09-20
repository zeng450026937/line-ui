import Vue from 'vue';

export default Vue.extend({
  name: 'LifecycleLogger',

  props: {
    tag: {
      type: String,
      default: () => ('div'),
    },

    label: {
      required: true,
    },
  },

  created() {
    console.log(`${this.label} created hooked.`); 
  },

  beforeMount() {
    console.log(`${this.label} beforeMount hooked.`); 
  },

  mounted() {
    console.log(`${this.label} mounted hooked.`); 
  },

  beforeUpdate() {
    console.log(`${this.label} beforeUpdate hooked.`); 
  },

  updated() {
    console.log(`${this.label} updated hooked.`); 
  },

  activated() {
    console.log(`${this.label} activated hooked.`); 
  },

  deactivated() {
    console.log(`${this.label} deactivated hooked.`); 
  },

  beforeDestroy() {
    console.log(`${this.label} beforeDestroy hooked.`); 
  },

  destroyed() {
    console.log(`${this.label} destroyed hooked.`); 
  },
  
  render(h) {
    return h(this.tag, this.$scopedSlots.default());
  },
});
