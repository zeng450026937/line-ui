
let lastId = 0;

export const getOverlays = (doc: Document, selector?: string): HTMLElement[] => {
  if (selector === undefined) {
    selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover,ion-toast';
  }
  return (Array.from(doc.querySelectorAll(selector)) as HTMLElement[])
    .filter(c => (c as any).overlayIndex > 0);
};

export const getOverlay = (
  doc: Document, overlayTag?: string, id?: string,
): HTMLElement | undefined => {
  const overlays = getOverlays(doc, overlayTag);
  return (id === undefined)
    ? overlays[overlays.length - 1]
    : overlays.find(o => o.id === id);
};

export const connectListeners = (doc: Document) => {
  if (lastId === 0) {
    lastId = 1;
    // trap focus inside overlays
    doc.addEventListener('focusin', (ev) => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && (lastOverlay as any).backdropDismiss && !isDescendant(lastOverlay, ev.target as HTMLElement)) {
        const firstInput = lastOverlay.querySelector('input,button') as HTMLElement | null;
        if (firstInput) {
          firstInput.focus();
        }
      }
    });

    // handle back-button click
    doc.addEventListener('ionBackButton', (ev) => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && (lastOverlay).backdropDismiss) {
        (ev as BackButtonEvent).detail.register(100, () => {
          return lastOverlay.dismiss(undefined, BACKDROP);
        });
      }
    });

    // handle ESC to close overlay
    doc.addEventListener('keyup', (ev) => {
      if (ev.key === 'Escape') {
        const lastOverlay = getOverlay(doc);
        if (lastOverlay && lastOverlay.backdropDismiss) {
          lastOverlay.dismiss(undefined, BACKDROP);
        }
      }
    });
  }
};

export const prepareOverlay = (<)T extends HTMLIonOverlayElement>(el: T) => {
  const doc = document;
  connectListeners(doc);
  const overlayIndex = lastId++;
  el.overlayIndex = overlayIndex;
  if (!el.hasAttribute('id')) {
    el.id = `ion-overlay-${ overlayIndex }`;
  }
};

const createController = (tagName: string) => {};
