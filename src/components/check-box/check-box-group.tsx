import { createNamespace } from '@/utils/namespace';
import { useGroup, CheckState } from '@/mixins/use-group';
import '@/components/check-box/check-box-group.scss';

export { CheckState };

const NAMESPACE = 'CheckBoxGroup';
const [createComponent, bem] = createNamespace('check-box-group');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  props : {
    nextCheckState : {
      type : Function,
      default(checkState: CheckState) {
        return checkState === CheckState.Checked ? CheckState.Unchecked : CheckState.Checked;
      },
    },
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
