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
    console.log(`${this.label} created.`); 
  },

  beforeMount() {
    console.log(`${this.label} beforeMount.`); 
  },

  mounted() {
    console.log(`${this.label} mounted.`); 
  },

  beforeUpdate() {
    console.log(`${this.label} beforeUpdate.`); 
  },

  updated() {
    console.log(`${this.label} updated.`); 
  },

  activated() {
    console.log(`${this.label} activated.`); 
  },

  deactivated() {
    console.log(`${this.label} deactivated.`); 
  },

  beforeDestroy() {
    console.log(`${this.label} beforeDestroy.`); 
  },

  destroyed() {
    console.log(`${this.label} destroyed.`); 
  },
  
  render(h) {
    return h(this.tag, this.$scopedSlots.default());
  },
});
