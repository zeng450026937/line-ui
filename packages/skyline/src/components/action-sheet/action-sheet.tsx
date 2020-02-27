import { createNamespace } from 'skyline/utils/namespace';
import { usePopup } from 'skyline/mixins/use-popup';
import { Overlay } from 'skyline/components/overlay';
import { iosEnterAnimation } from 'skyline/components/action-sheet/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/components/action-sheet/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/components/action-sheet/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/components/action-sheet/animations/md.leave';
import { ActionSheetButton } from 'skyline/components/action-sheet/action-sheet-interface';

const [createComponent, bem] = createNamespace('action-sheet');

export default createComponent({
  mixins : [usePopup()],

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

  created() {
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
  },

  render() {
    const { optionActions, cancelAction } = this;

    return (
      <div
        v-show={this.visible}
        role="dialog"
        aria-modal="true"
        class={bem({
          translucent : this.translucent,
        })}
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
