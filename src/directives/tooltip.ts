import { VNodeDirective } from 'vue';
import { TooltipController } from '@/controller/tooltip';
import { setupEventHandlers, removeEventHandlers } from '@/utils/event-handler';

const ctrl = new TooltipController();

function inserted(el: HTMLElement, binding: VNodeDirective) {
  if (binding.value === false) return;

  let tooltip: any;

  function open(ev: Event) {
    if (!tooltip) {
      tooltip = ctrl.create({ text: binding.value, delay: 300 });
    }
    tooltip.open(ev);
  }
  function close() {
    if (!tooltip) return;
    if (!tooltip.close()) {
      tooltip.$destroy();
    }
    tooltip = null;
  }

  const listeners = {
    mouseenter : open,
    mouseleave : close,
    focus      : open,
    blur       : close,
  };

  setupEventHandlers(el, listeners);

  (el as any).vTooltip = {
    destroy : () => {
      removeEventHandlers(el, listeners);
      tooltip && tooltip.close();
    },
  };
}

function unbind(el: HTMLElement, binding: VNodeDirective) {
  const { vTooltip } = (el as any);

  if (!vTooltip) return;

  vTooltip.destroy();

  delete (el as any).vTooltip;
}

function update(el: HTMLElement, binding: VNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }

  if (binding.oldValue !== false) {
    const { vTooltip } = (el as any);
    vTooltip.tooltip.text = binding.value;
    return;
  }

  unbind(el, binding);
}

export const Tooltip = {
  inserted,
  unbind,
  update,
};

export default Tooltip;
