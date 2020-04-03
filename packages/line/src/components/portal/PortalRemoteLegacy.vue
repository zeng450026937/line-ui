<script>
import wormhole from './wormhole';

export default {
  name: 'portal-remote',

  props: {
    name: String,

    disabled: Boolean,

    multi: {
      type: Boolean,
      default: true,
    },

    transition: [String, Object, Function],
  },

  computed: {
    computedTransports() {
      const transports = wormhole.transports(this.name);

      if (this.multi) return transports;

      return [transports[transports.length - 1]];
    },

    computedPayloads() {
      return this.computedTransports.map((transport) => transport.payload());
    },
  },

  render(h) {
    console.log('portal remote legacy');
    if (this.disabled) return h();

    const tag = this.transition || 'div';
    const children = this.computedPayloads;

    return h(tag, children);
  },
};
</script>

<style lang="stylus"></style>
