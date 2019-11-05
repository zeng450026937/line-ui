<script>
import ProgressIndicator from './ProgressIndicator.vue';
import { AbstractButton } from '@/components/button';

export default {
  name: 'DelayButton',

  extends: AbstractButton,

  props: {
    delay: {
      type: Number,
      default: 3000,
    },
  },

  data() {
    return {
      progress: 0,
    };
  },

  methods: {
    genBackground() {
      return this.$createElement(ProgressIndicator, {
        props: { value: progress },
        style: { 'transform-duration': `${ delay }ms` },
      });
    },

    onPressDown() {
      this.progress = 100;
    },
    onPressUp() {
      this.progress = 0;
    },
  },

  created() {
    this.$emit('activated');
    this.staticClass += ' delay-button';
  },
};
</script>

<style lang="scss">

.delay-button {}

</style>
