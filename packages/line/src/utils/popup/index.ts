/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { BackButtonEvent } from '@line-ui/line/src/utils/hardware-back-button';

export type Transition = {
  name?: string;
  appear?: boolean;
  css?: boolean;
  mode?: string;
  type?: string;
  enterClass?: string;
  leaveClass?: string;
  enterToClass?: string;
  leaveToClass?: string;
  enterActiveClass?: string;
  leaveActiveClass?: string;
  appearClass?: string;
  appearActiveClass?: string;
  appearToClass?: string;
  duration?: number | string | object;
};

export type PopupInterface = Vue & {
  transition: string | Transition;
  dim: boolean;
  translucent: boolean;
  modal: boolean;
  open(ev?: Event): Promise<void> | void;
  close(reason?: string): Promise<void> | void;
  focus(): void;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  activeFocus: boolean;
  event?: Event;
  visible: boolean;
  destroyWhenClose: boolean;
};

export const popupStack = [] as Array<PopupInterface>;

export class PopupContext {
  private stack: Array<PopupInterface>;
  private base = 2000;
  private index = 0;

  constructor(stack: Array<PopupInterface>) {
    this.stack = stack;
  }

  getPopup(index: number = this.stack.length - 1) {
    return this.stack[index];
  }
  findPopup(matcher: (popup: PopupInterface) => boolean) {
    let index = this.stack.length - 1;
    let popup = this.stack[index];
    while (popup) {
      if (matcher(popup)) {
        break;
      }
      index--;
      popup = this.stack[index];
    }
    return popup;
  }
  getActiveFocusPopup() {
    return this.findPopup(p => p.activeFocus);
  }
  getOverlayIndex() {
    return this.base + this.index;
  }

  push(popup: PopupInterface) {
    this.stack.push(popup);
    this.index++;
  }

  pop(popup: PopupInterface) {
    this.stack.splice(this.stack.indexOf(popup), 1);
    if (!this.stack.length) {
      this.index = 0;
    }
  }
}

export const popupContext = new PopupContext(popupStack);

export function setupPopup(doc: Document = document) {
  doc.addEventListener('focusin', ev => {
    const lastPopup = popupContext.getActiveFocusPopup();
    if (!lastPopup) return;
    if (lastPopup.closeOnClickOutside) return;
    if (lastPopup.$el.contains(ev.target as HTMLElement)) return;
    lastPopup.focus();
  });

  // handle back-button click
  doc.addEventListener('lineBackButton', ev => {
    const lastPopup = popupContext.getPopup();
    if (!lastPopup) return;
    if (!lastPopup.closeOnClickOutside) return;
    (ev as BackButtonEvent)
      .detail
      .register(
        100,
        () => lastPopup.close(),
      );
  });

  // handle ESC to close popup
  doc.addEventListener('keyup', ev => {
    if (ev.key === 'Escape') {
      const lastPopup = popupContext.getPopup();
      if (!lastPopup) return;
      if (!lastPopup.closeOnEscape) return;
      lastPopup.close();
    }
  });
}
