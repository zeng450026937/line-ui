<script>
import Vue from 'vue';

function clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}

export default Vue.extend({
  name: 'ProgressIndicator',

  functional: true,

  props: {
    from: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 0,
    },
  },

  render(h, { props, data }) {
    console.log(props);
    const { from, to, value } = props;
    const normalizedValue = clamp(value, from, to);
    const tag = 'div';
    const position = (normalizedValue - from) / (to - from);
    const progress = h(tag, {
      staticClass: 'progress',
      style: {
        'background-color': '#10c29b',
        transform: `scaleX(${ position })`,
      },
    });

    return h(tag, {
      staticClass: 'progress-indicator',
    }, [progress]);
  },
});
</script>

<style lang="scss">

.progress-indicator {
  position: relative;
  width: 100%;
  height: 5px;
  margin: 0;
  padding: 0;

  .progress {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    transform-origin: left top;
    transition: transform 0.4s linear 0s;
  }
}

</style>
