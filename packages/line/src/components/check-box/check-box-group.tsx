import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckGroup } from '@line-ui/line/src/mixins/use-check-group';

const NAMESPACE = 'CheckBoxGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-box-group');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckGroup(NAMESPACE),
  ],

  props : {
    // nextCheckState : {
    //   type : Function,
    //   default(checkState: CheckState) {
    //     return checkState === CheckState.Checked ? CheckState.Unchecked : CheckState.Checked;
    //   },
    // },
  },


  methods : {
    onClick() {
      this.checkState = (this.nextCheckState as Function)(this.checkState);
    },
  },


  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
