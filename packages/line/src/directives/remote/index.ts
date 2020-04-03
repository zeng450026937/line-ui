import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { isString } from '@line-ui/line/src/utils/helpers';
import { getApp } from '@line-ui/line/src/utils/dom';

export interface RemoteOptions {
  container?: string | Element;
}

export function createRemote(el: HTMLElement, options: RemoteOptions) {
  const { container = '' } = options;
  const containerEl = isString(container) ? getApp(el, container) : container;

  const { parentElement: originParent, nextElementSibling: originSibling } = el;

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
  const { vRemote } = el as any;

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

export const vRemote = /*#__PURE__*/ defineDirective({
  name: 'remote',
  inserted,
  update,
  unbind,
});

export default vRemote;
