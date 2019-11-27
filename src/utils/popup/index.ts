/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { BackButtonEvent } from '@/utils/hardware-back-button';

export type Transition = {
  name: string;
  appear: boolean;
  css: boolean;
  mode: string;
  type: string;
  enterClass: string;
  leaveClass: string;
  enterToClass: string;
  leaveToClass: string;
  enterActiveClass: string;
  leaveActiveClass: string;
  appearClass: string;
  appearActiveClass: string;
  appearToClass: string;
  duration: number | string | object;
};

export type PopupInterface = Vue & {
  transition: string | Transition,
  dim: boolean;
  translucent: boolean;
  modal: boolean;
  open(): Promise<void> | void;
  close(reason?: string): Promise<void> | void;
  focus(): void;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  destroyWhenClose: boolean;
};

export const popupStack = [] as Array<PopupInterface>;

export function getPopup() {
  return popupStack[popupStack.length - 1];
}

export function setupPopup(doc: Document = document) {
  doc.addEventListener('focusin', ev => {
    const lastPopup = getPopup();
    if (lastPopup
      && lastPopup.closeOnClickOutside
      && !lastPopup.$el.contains(ev.target as HTMLElement)
    ) {
      lastPopup.focus();
    }
  });

  // handle back-button click
  doc.addEventListener('lineBackButton', ev => {
    const lastPopup = getPopup();
    if (lastPopup && lastPopup.closeOnClickOutside) {
      (ev as BackButtonEvent).detail.register(100, () => {
        lastPopup.close();
      });
    }
  });

  // handle ESC to close popup
  doc.addEventListener('keyup', ev => {
    if (ev.key === 'Escape') {
      const lastPopup = getPopup();
      if (lastPopup && lastPopup.closeOnEscape) {
        lastPopup.close();
      }
    }
  });
}
