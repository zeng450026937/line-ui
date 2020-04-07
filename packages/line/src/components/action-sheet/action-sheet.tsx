import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { Overlay } from '@line-ui/line/src/components/overlay';
import Action from '@line-ui/line/src/components/action-sheet/action';
import ActionGroup from '@line-ui/line/src/components/action-sheet/action-group';
import ActionSheetTitle from '@line-ui/line/src/components/action-sheet/action-sheet-title';

import { iosEnterAnimation } from '@line-ui/line/src/components/action-sheet/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/action-sheet/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/action-sheet/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/action-sheet/animations/md.leave';
import { ActionSheetButtonOption } from '@line-ui/line/src/components/action-sheet/action-sheet-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('action-sheet');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ usePopup()],

  provide(): any {
    return {
      Item: this,
    };
  },

  props: {
    header: String,
    subHeader: String,
    actions: Array,
  },

  computed: {
    normalizedActions(): ActionSheetButtonOption[] {
      const { actions } = this as {
        actions: (ActionSheetButtonOption | string)[];
      };
      return actions.map((action) => {
        return typeof action === 'string' ? { text: action } : action;
      });
    },

    optionActions(): ActionSheetButtonOption[] {
      return this.normalizedActions.filter(
        (action) => action.role !== 'cancel'
      );
    },

    cancelAction(): ActionSheetButtonOption | undefined {
      return this.normalizedActions.find((action) => action.role === 'cancel');
    },
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl));
    });
  },

  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },

  render() {
    const { optionActions, cancelAction, translucent } = this;

    return (
      <div
        v-show={this.visible}
        role="dialog"
        aria-modal="true"
        class={bem({ translucent })}
      >
        <Overlay visible={this.dim} onTap={this.onTap}></Overlay>

        <div role="dialog" class={bem('wrapper')}>
          {this.slots() ? (
            <div class={bem('container')}>{this.slots()}</div>
          ) : (
            <div class={bem('container')}>
              <ActionGroup>
                {this.header && (
                  <ActionSheetTitle
                    header={this.header}
                    subHeader={this.subHeader}
                  ></ActionSheetTitle>
                )}

                {optionActions.map((action) => (
                  <Action option={action}></Action>
                ))}
              </ActionGroup>
              {cancelAction && (
                <ActionGroup cancel={true}>
                  <Action option={cancelAction}></Action>
                </ActionGroup>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
});
