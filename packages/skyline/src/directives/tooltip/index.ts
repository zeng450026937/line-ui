import { VNodeDirective } from 'vue';
import { TooltipController } from 'skyline/controller/tooltip';

interface TooltipVNodeDirective extends VNodeDirective {
  value?: string | boolean;
}

const ctrl = new TooltipController();

function inserted(el: HTMLElement, binding: TooltipVNodeDirective) {
  if (binding.value === false) return;

  const tooltip = ctrl.create({
    text        : binding.value,
    delay       : 300,
    trigger     : el,
    openOnHover : true,
  });
  tooltip.destroyWhenClose = false;

  (el as any).vTooltip = {
    tooltip,
    destroy : () => {
      tooltip.destroyWhenClose = true;
      tooltip.close() || tooltip.$destroy();
    },
  };
}

function unbind(el: HTMLElement, binding: TooltipVNodeDirective) {
  const { vTooltip } = el as any;
  if (!vTooltip) return;
  vTooltip.destroy();
  delete (el as any).vTooltip;
}

function update(el: HTMLElement, binding: TooltipVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.value === false) {
    unbind(el, binding);
    return;
  }
  const { vTooltip } = (el as any);
  vTooltip.tooltip.text = binding.value;
}

export const Tooltip = {
  inserted,
  unbind,
  update,
};

export default Tooltip;
