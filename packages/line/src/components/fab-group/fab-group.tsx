import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useGroup } from '@line-ui/line/src/mixins/use-group';
import { useLazy } from '@line-ui/line/src/mixins/use-lazy';
import { useModel } from '@line-ui/line/src/mixins/use-model';
import { isDef, isObject } from '@line-ui/line/src/utils/helpers';
import { VNodeData } from 'vue';

const NAMESPACE = 'FabGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('fab-group');

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ useGroup(NAMESPACE),
    /*#__PURE__*/ useLazy(),
    /*#__PURE__*/ useModel('visible'),
  ],

  props: {
    // string | object | false
    transition: null as any,

    exclusive: {
      type: Boolean,
      default: true,
    },
    // 'start' | 'end' | 'top' | 'bottom' = 'bottom'
    side: String,
  },

  beforeMount() {
    this.visible = this.inited =
      this.visible ||
      (isDef(this.$attrs.visible) &&
        (this.$attrs.visible as string | boolean) !== false);
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
          [`side-${side}`]: true,
        })}
        on={this.$listeners}
      >
        {this.visible &&
          this.slots(
            'default',
            { side },
            (index) =>
              ({
                key: index,
                style: {
                  animationDelay: `${(index as number) * 0.03}s`,
                },
              } as VNodeData)
          )}
      </TransitionGroup>
    );
  },
});
