import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/mixins/use-group';
import { useLazy } from '@/mixins/use-lazy';
import { useModel } from '@/mixins/use-model';
import { useTransition } from '@/mixins/use-transition';
import { isDef } from '@/utils/helpers';
import '@/components/fab-group/fab-group.scss';

const NAMESPACE = 'FabGroup';
const [createComponent, bem] = createNamespace('fab-group');

export default createComponent({
  mixins : [
    useLazy(),
    useModel('visible'),
    useGroup(NAMESPACE),
  ],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
    side : String,
  },

  beforeMount() {
    this.visible = this.inited = this.visible || (
      isDef(this.$attrs.visible)
        && (this.$attrs.visible as string | boolean) !== false
    );
  },

  render() {
    const { side = 'bottom' } = this;
    return (
      <div
        v-show={this.visible}
        class={bem({
          [side] : true,
        })}
      >
        {/* {this.slots() && this.slots()!.map((vnode) => { return vnode; })} */}
      </div>
    );
  },
});
