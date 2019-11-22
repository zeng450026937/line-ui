/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { BackButtonEvent } from '@/utils/hardware-back-button';

export type PopupInterface = Vue & {
  open(): Promise<void> | void;
  close(): Promise<void> | void;
  focus(): void;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
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
        return lastPopup.close();
      });
    }
  });

  // handle ESC to close overlay
  doc.addEventListener('keyup', ev => {
    if (ev.key === 'Escape') {
      const lastPopup = getPopup();
      if (lastPopup && lastPopup.closeOnEscape) {
        lastPopup.close();
      }
    }
  });
}
