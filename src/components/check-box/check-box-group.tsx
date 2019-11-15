import { createNamespace } from '@/utils/namespace';
import { useGroup, CheckState } from '@/components/group';
import '@/components/check-box/check-box-group.scss';

export { CheckState };

const NAMESPACE = 'CheckBoxGroup';

const [createComponent, bem] = createNamespace('check-box-group');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  props : {
    nextCheckState : {
      type : Function,
      default(checkState: any) {
        return checkState === CheckState.Checked ? CheckState.Unchecked : CheckState.Checked;
      },
    },
  },


  methods : {
    onClick() {
      if (this.checkable && !this.disabled) {
        this.checkState = this.nextCheckState(this.checkState);
      }
    },
  },

  render() {
    return (
      <div class="check-box-group">
        {this.slots()}
      </div>
    );
  },
});
