<script>
import wormhole from './wormhole';

window.wormhole = wormhole;

let globalId = 1;

export default {
  name: 'portal',

  props: {
    remote: [String, Array],

    order: Number,

    disabled: Boolean,
  },

  computed: {
    transport() {
      return {
        payload: this.payload(),
        order: this.order,
        to: this.remote,
      };
    },
  },

  watch: {
    remote: 'transfer',
    disabled: 'transfer',
  },

  methods: {
    payload() {
      return this.disabled ? null : this.$scopedSlots.default;
    },

    async transfer() {
      // debounce
      await this.$nextTick();
      this.hole.transfer(this.transport);
    },
  },

  updated() {
    console.log('portal updated');
    if (this.disabled) return;
    this.transport.payload = this.payload();
  },

  created() {
    this.id = `portal-${ globalId++ }`;
    this.hole = wormhole.open(this.id);
  },

  mounted() {
    if (this.disabled) return;
    this.transfer();
  },

  beforeDestroy() {
    if (this.hole) {
      this.hole.close();
    }
  },

  render(h) {
    console.log('portal legacy');
    if (this.disabled && this.$scopedSlots.default) {
      return this.$scopedSlots.default();
    }
    return h();
  },
};
</script>

<style lang="stylus">

</style>
