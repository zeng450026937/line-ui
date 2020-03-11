import { DirectiveOptions, VNodeDirective } from 'vue';

interface RemoteVNodeDirective extends VNodeDirective {
  value?: boolean;
  arg: string;
}

const CONTAINER = '[skyline-app]';

function inserted(el: HTMLElement, binding: RemoteVNodeDirective) {
  if (binding.value === false) return;

  const container = binding.arg || CONTAINER;
  const containerEl = el.closest(container) || document.querySelector(container) || document.body;

  if (!containerEl) return;

  const { parentElement, nextElementSibling } = el;

  const destroy = () => {
    if (!parentElement!.contains(el)) {
      el.remove();
      return;
    }
    parentElement!.insertBefore(el, nextElementSibling);
  };

  (el as any).vRemote = {
    container,
    destroy,
  };

  containerEl.appendChild(el);
}

function unbind(el: HTMLElement, binding: RemoteVNodeDirective) {
  if (!el.parentElement) {
    el.remove();
    return;
  }

  const { vRemote } = (el as any);

  if (!vRemote) return;

  vRemote.destroy();

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
