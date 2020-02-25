import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/mixins/use-group';
import { useLazy } from '@/mixins/use-lazy';
import { useModel } from '@/mixins/use-model';
import { isDef, isObject } from '@/utils/helpers';

const NAMESPACE = 'FabGroup';
const [createComponent, bem] = createNamespace('fab-group');

export default createComponent({
  mixins : [
    useGroup(NAMESPACE),
    useLazy('visible'),
    useModel('visible'),
  ],

  props : {
    // string | object | false
    transition : null as any,

    exclusive : {
      type    : Boolean,
      default : true,
    },
    // 'start' | 'end' | 'top' | 'bottom' = 'bottom'
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
    const TransitionGroup = 'transition-group';
    const transition = isObject(this.transition)
      ? this.transition
      : { name: this.transition || 'line-scale' };
    return (
      <TransitionGroup
        {...{ props: transition }}
        tag="div"
        appear
        class={bem({
          [`side-${ side }`] : true,
        })}
        on={this.$listeners}
      >
        {
          this.visible && this.slots(
            'default',
            { side },
            (index) => ({
              key   : index,
              style : {
                animationDelay : `${ index * 0.03 }s`,
              },
            }),
          )
        }
      </TransitionGroup>
    );
  },
});
