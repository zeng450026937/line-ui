<script>
let globalId = 1;

export default {
  name : 'portal',

  props : {
    remote : {
      type     : String,
      required : true,
    },

    disabled : Boolean,
  },

  inject : ['Portal'],

  watch : {
    remote   : 'transfer',
    disabled : 'transfer',
  },

  methods : {
    transfer() {
      this.portal.transfer(this.payload);
    },
  },

  created() {
    const { Portal } = this;
    this.id = `portal-${ globalId++ }`;
    this.portal = Portal.open(this.id);
    this.payload = {
      to   : this.remote,
      slot : null,
    };
  },

  mounted() {
    if (this.disabled) return;
    this.payload.slot = this.$scopedSlots.default;
    this.transfer();
  },

  updated() {
    if (this.disabled) return;
    this.payload.slot = this.disabled ? null : this.$scopedSlots.default;
  },

  beforeDestroy() {
    if (this.portal) {
      this.portal.close();
    }
  },

  render(h) {
    if (this.disabled && this.$scopedSlots.default) {
      return this.$scopedSlots.default();
    }
    return h();
  },
};
</script>

<style lang="stylus">

</style>
