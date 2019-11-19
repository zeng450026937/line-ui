import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE), useRipple()],

  props : {
    // This property holds a textual description of the button.
    text        : String,
    // This property holds whether the button is visually down.
    // Unless explicitly set, this property follows the value of pressed.
    down        : Boolean,
    // This property holds whether the button is highlighted.
    highlighted : Boolean,
    // This property holds whether the button is disabled.
    disabled    : Boolean,
    // This property holds whether the button is flat.
    flat        : Boolean,
    // This property holds whether the button is block.
    block       : Boolean,
    // This property holds whether the button is circle.
    circle      : Boolean,
    // This property holds whether the button is round.
    round       : Boolean,
    // This property holds whether the button is outline.
    outline     : Boolean,
  },

  methods : {
    onClick() {
      this.toggle();
    },
  },

  render() {
    return (
      <div
        class={bem({
          down        : this.down,
          highlighted : this.highlighted,
          checked     : this.checked,
          disabled    : this.disabled,
          flat        : this.flat,
          block       : this.block,
          circle      : this.circle,
          round       : this.round,
          outline     : this.outline,
        })}
        on={ this.$listeners }
        onClick={ this.onClick }
      >
        { this.slots() || this.text }
      </div>
    );
  },
});
