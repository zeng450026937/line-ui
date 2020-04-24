import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { on, off } from '@line-ui/line/src/utils/dom';

export interface DragOptions {
  callback: (dragging: boolean, ev: Event) => void;
  passive?: boolean;
}

export function createDrag(el: HTMLElement, options: DragOptions) {
  const { callback } = options;
  let dragging = false;

  const mousedown = (ev: UIEvent) => {
    if (ev.which !== 1) return;

    ev.preventDefault();
    dragging = true;

    const win = window;
    const drag = (ev: Event) => callback(dragging, ev);
    const mouseup = (ev: Event) => {
      dragging = false;
      drag(ev);

      off(win, 'mousemove', drag);
      off(win, 'mouseup', mouseup);
    };

    on(win, 'mousemove', drag, options);
    on(win, 'mouseup', mouseup, options);
  };

  const mousedownOff = on(el, 'mousedown', mousedown as any, options);

  const destroy = () => {
    mousedownOff();
  };

  return {
    options,
    destroy,
  };
}

export interface DragVNodeDirective extends VNodeDirective {
  value?: (dragging: boolean, ev: Event) => void;
}

function inserted(el: HTMLElement, binding: DragVNodeDirective) {
  const { value: callback, modifiers: options } = binding;

  if (!callback) return;

  (el as any).vDrag = createDrag(el, {
    callback,
    ...options,
  });
}

function unbind(el: HTMLElement) {
  const { vDrag } = el as any;

  if (!vDrag) return;

  vDrag.destroy();

  delete (el as any).vDrag;
}

function update(el: HTMLElement, binding: DragVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vDrag = /*#__PURE__*/ defineDirective({
  name: 'drag',
  inserted,
  unbind,
  update,
});

export default vDrag;
