import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/src/utils/directive';
import { isString } from 'skyline/src/utils/helpers';

const CONTAINER = '[skyline-app]';

export interface RemoteOptions {
  container?: string | Element;
}

export function createRemote(el: HTMLElement, options: RemoteOptions) {
  const { container = CONTAINER } = options;
  const containerEl = isString(container)
    ? el.closest(container) || document.querySelector(container) || document.body
    : container;

  const {
    parentElement: originParent,
    nextElementSibling: originSibling,
  } = el;

  const destroy = () => {
    const { parentElement } = el;

    if (!parentElement || !originParent) {
      el.remove();
      return;
    }

    originParent.insertBefore(el, originSibling);
  };

  containerEl.appendChild(el);

  return {
    container,
    destroy,
  };
}

export interface RemoteVNodeDirective extends VNodeDirective {
  value?: boolean;
  arg?: string;
}

function inserted(el: HTMLElement, binding: RemoteVNodeDirective) {
  const { value, arg } = binding;

  if (value === false) return;

  (el as any).vRemote = createRemote(el, { container: arg });
}

function unbind(el: HTMLElement) {
  const { vRemote } = (el as any);

  if (!vRemote) return;

  vRemote.destroy();

  delete (el as any).vRemote;
}

function update(el: HTMLElement, binding: RemoteVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue !== false) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vRemote = defineDirective({
  name : 'remote',
  inserted,
  update,
  unbind,
});

export default vRemote;
