import { DirectiveOptions, VNodeDirective } from 'vue';

interface RemoteVNodeDirective extends VNodeDirective {
  value?: boolean;
  arg: string;
}

const CONTAINER = '[skyline-app]';

type VRemote = {
  parentElement: HTMLElement;
  nextElementSibling: HTMLElement;
}

function inserted(el: HTMLElement, binding: RemoteVNodeDirective) {
  if (binding.value === false) return;
  const container = binding.arg || CONTAINER;
  const containerEl = el.closest(container) || document.querySelector(container) || document.body;
  if (containerEl) {
    (el as any).vRemote = {
      parentElement      : el.parentElement,
      nextElementSibling : el.nextElementSibling,
    } as VRemote;
    containerEl.appendChild(el);
  }
}

function unbind(el: HTMLElement, binding: RemoteVNodeDirective) {
  if (!el.parentElement) {
    el.remove();
    return;
  }

  const { vRemote } = (el as any);

  if (!vRemote) return;

  const { parentElement, nextElementSibling } = vRemote as VRemote;

  if (!parentElement.contains(el)) {
    el.remove();
    return;
  }

  parentElement.insertBefore(el, nextElementSibling);

  delete (el as any).vRemote;
}

function update(el: HTMLElement, binding: RemoteVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue !== false) {
    unbind(el, binding);
  }
  inserted(el, binding);
}

export const VRemote = {
  inserted,
  update,
  unbind,
} as DirectiveOptions;

export default VRemote;
