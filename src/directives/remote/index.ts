import { DirectiveOptions, VNodeDirective } from 'vue';

interface RemoteVNodeDirective extends VNodeDirective {
  value?: boolean
  arg: string
}

const CONTAINER = '.application-window';

type VRemote = {
  parentElement: HTMLElement,
  nextElementSibling: HTMLElement,
}

function inserted(el: HTMLElement, binding: RemoteVNodeDirective) {
  debugger;
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
  if (vRemote) {
    const { parentElement, nextElementSibling } = vRemote;
    parentElement.insertBefore(el, nextElementSibling);
  }
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

export const Remote = {
  inserted,
  update,
  unbind,
} as DirectiveOptions;

export default Remote;
