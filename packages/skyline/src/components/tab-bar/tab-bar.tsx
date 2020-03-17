import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import { useCheckGroupWithModel } from 'skyline/src/mixins/use-check-group';

const NAMESPACE = 'TabBar';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('tab-bar');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckGroupWithModel(NAMESPACE),
    /*#__PURE__*/ useColor(),
  ],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
    value : {
      type    : String,
      default : '',
    },
    translucent : {
      type    : Boolean,
      default : false,
    },
    keyboardVisible : {
      type    : Boolean,
      default : false,
    },
    selectedTab : {
      type : String,
    },
  },

  methods : {
    selectedTabChanged() {
      if (this.selectedTab !== undefined) {
        this.$emit('tabBarChanged', {
          tab : this.selectedTab,
        });
      }
    },

  },

  watch : {
    selectedTab() {
      this.selectedTabChanged();
    },
  },

  beforeMount() {
    this.selectedTabChanged();
  },

  render() {
    const { translucent, keyboardVisible } = this;

    return (
      <div
        class={[
          bem({
            translucent,
            hidden : keyboardVisible,
          }),
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
