
const LINE_FOCUSED = 'line-focused';
const LINE_FOCUSABLE = 'line-focusable';
const FOCUS_KEYS = ['Tab', 'ArrowDown', 'Space', 'Escape', ' ', 'Shift', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp'];

export const setupFocusVisible = () => {
  let currentFocus: Element[] = [];
  let keyboardMode = true;

  const doc = document;
  const setFocus = (elements: Element[]) => {
    currentFocus.forEach(el => el.classList.remove(LINE_FOCUSED));
    elements.forEach(el => el.classList.add(LINE_FOCUSED));
    currentFocus = elements;
  };
  const pointerDown = () => {
    keyboardMode = false;
    setFocus([]);
  };

  doc.addEventListener('keydown', ev => {
    keyboardMode = FOCUS_KEYS.includes(ev.key);
    if (!keyboardMode) {
      setFocus([]);
    }
  });

  doc.addEventListener('focusin', ev => {
    if (keyboardMode && ev.composedPath) {
      const toFocus = ev.composedPath().filter((el: any) => {
        if (el.classList) {
          return el.classList.contains(LINE_FOCUSABLE);
        }
        return false;
      }) as Element[];
      setFocus(toFocus);
    }
  });
  doc.addEventListener('focusout', () => {
    if (doc.activeElement === doc.body) {
      setFocus([]);
    }
  });
  doc.addEventListener('touchstart', pointerDown);
  doc.addEventListener('mousedown', pointerDown);
};
