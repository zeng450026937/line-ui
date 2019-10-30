<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'portal-remote',

  props: {
    name: {
      type: String,
      required: true,
    },

    disabled: Boolean,

    transition: [String, Object],
  },

  inject: ['Portal'],

  computed: {
    payloads() {
      return this.Portal.payloads(this.name).map(payload => payload.slot());
    },
  },

  render(h) {
    if (this.disabled) {
      return h();
    }
    return h(
      this.transition || 'div',
      { staticClass: `${this.name}` },
      this.payloads,
    );
  },
});
</script>
