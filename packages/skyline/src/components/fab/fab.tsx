import { createNamespace } from 'skyline/utils/namespace';
import { useModel } from 'skyline/mixins/use-model';
import { useClickOutside } from 'skyline/mixins/use-click-outside';
import { isDef } from 'skyline/utils/helpers';
import { FabGroup } from 'skyline/components/fab-group';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('fab');
const FAB_SIDES = ['start', 'end', 'top', 'bottom'];

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useModel('activated'),
    /*#__PURE__*/ useClickOutside(),
  ],

  provide() {
    return {
      FAB : this,
    };
  },

  props : {
    // 'start' | 'end' | 'center'
    horizontal : String,
    // 'top' | 'bottom' | 'center'
    vertical   : String,
    edge       : Boolean,
  },

  created() {
    this.$on('clickoutside', () => {
      console.log('clickoutside');
      this.activated = false;
    });
  },

  beforeMount() {
    this.activated = this.activated || (
      isDef(this.$attrs.activated)
        && (this.$attrs.activated as string | boolean) !== false
    );
  },

  methods : {
    toggle() {
      this.activated = !this.activated;
    },
  },

  render() {
    const {
      horizontal = 'start',
      vertical = 'top',
      edge,
      activated,
    } = this;
    return (
      <div
        class={bem({
          [`horizontal-${ horizontal }`] : isDef(horizontal),
          [`vertical-${ vertical }`]     : isDef(vertical),
          edge,
        })}
        on={this.$listeners}
      >
        {
          this.slots(
            'indicator',
            { activated },
            { on: { click: this.toggle } },
          )
        }
        {
          FAB_SIDES.map((side) => (
            this.hasSlot(side) && <FabGroup vModel={this.activated} side={side} onClicked={this.toggle}>
              { this.slots(side) }
            </FabGroup>
          ))
        }
      </div>
    );
  },
});
