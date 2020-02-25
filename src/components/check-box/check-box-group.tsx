import { createNamespace } from '@/utils/namespace';
import { useCheckGroup } from '@/mixins/use-check-group';

const NAMESPACE = 'CheckBoxGroup';
const [createComponent, bem] = createNamespace('check-box-group');

export default createComponent({
  mixins : [useCheckGroup(NAMESPACE)],

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
