import { createNamespace } from 'skyline/src/utils/namespace';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { Overlay } from 'skyline/src/components/overlay';
import { iosEnterAnimation } from 'skyline/src/components/action-sheet/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/action-sheet/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/src/components/action-sheet/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/src/components/action-sheet/animations/md.leave';
import { ActionSheetButton } from 'skyline/src/components/action-sheet/action-sheet-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('action-sheet');

// TODO
const safeCall = (handler: any, arg?: any) => {
  if (typeof handler === 'function') {
    try {
      return handler(arg);
    } catch (e) {
      console.error(e);
    }
  }

  return undefined;
};

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
  ],

  props : {
    header    : String,
    subHeader : String,
    actions   : {
      type    : Array,
      default : [],
    },
  },

  computed : {
    normalizedActions(): ActionSheetButton[] {
      const { actions } = this as { actions: (ActionSheetButton | string)[] };
      return actions.map(action => {
        return (typeof action === 'string')
          ? { text: action }
          : action;
      });
    },

    optionActions(): ActionSheetButton[] {
      return this.normalizedActions.filter(action => action.role !== 'cancel');
    },

    cancelAction(): ActionSheetButton | undefined {
      return this.normalizedActions.find(action => action.role === 'cancel');
    },
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (builder: any) => {
      builder.build = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
    });
  },

  methods : {
    onTap() {
      this.$emit('overlay-tap');
    },

    async buttonClick(button: any) {
      const { role } = button;
      if (role === 'cancel') {
        return this.close(role);
      }

      const shouldClose = await this.callButtonHandler(button);
      if (shouldClose) {
        return this.close(button.role);
      }

      return Promise.resolve();
    },

    async callButtonHandler(button: ActionSheetButton | undefined) {
      if (button) {
        // a handler has been provided, execute it
        // pass the handler the values from the inputs
        const rtn = await safeCall(button.handler);
        if (rtn === false) {
          // if the return value of the handler is false then do not dismiss
          return false;
        }
      }

      return true;
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
        <Overlay
          visible={this.dim}
          onTap={this.onTap}
        >
        </Overlay>

        <div
          role="dialog"
          class={bem('wrapper')}
        >
          <div class={bem('container')}>
            <div class={bem('group')}>
              {
                this.header && (
                  <div class={bem('title')}>
                    {this.header}
                    {
                      this.subHeader && (
                        <div class={bem('sub-title')}>
                          {this.subHeader}
                        </div>
                      )
                    }
                  </div>
                )
              }

              {
                optionActions.map((action) => (
                  <button
                    type="button"
                    class={[
                      bem('button', { [`${ action.role }`]: !!action.role }),
                      'line-activatable',
                    ]}
                    onClick={() => this.buttonClick(action)}
                  >
                    <span class={bem('button-inner')}>
                      {action.text}
                    </span>
                  </button>
                ))
              }
            </div>

            {
              cancelAction && (
                <div class={bem('group', { cancel: true })}>
                  <button
                    type="button"
                    class={[
                      bem('button', { [`${ cancelAction.role }`]: !!cancelAction.role }),
                      'line-activatable',
                    ]}
                    onClick={() => this.buttonClick(cancelAction)}
                  >
                    <span class={bem('button-inner')}>
                      {cancelAction.text}
                    </span>
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  },
});
