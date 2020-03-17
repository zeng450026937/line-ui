import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/src/utils/directive';
import { TooltipController } from 'skyline/src/controller/tooltip';
import { isObject } from 'skyline/src/utils/helpers';

let ctrl: TooltipController | undefined;

export interface TooltipOptions {
  text: string;
  delay?: number;
  placement?: string;
  hover?: boolean;
  click?: boolean;
  active?: boolean;
}

export function createTooltip(el: HTMLElement, options: TooltipOptions) {
  const {
    text,
    delay = 300,
    placement, // top
    hover: openOnHover = true,
    click: openOnClick,
    active: activeFocus,
  } = options;

  if (!ctrl) {
    ctrl = /*#__PURE__*/ new TooltipController();
  }

  const tooltip = ctrl.create({
    trigger : el,
    text,
    delay,
    placement,
    openOnHover,
    openOnClick,
    activeFocus,
  });

  tooltip.destroyWhenClose = false;

  const destroy = () => {
    tooltip.destroyWhenClose = true;
    tooltip.close() || tooltip.$destroy();
  };

  return {
    tooltip,
    destroy,
  };
}

export interface TooltipVNodeDirective extends VNodeDirective {
  value?: false | string | TooltipOptions;
}

function inserted(el: HTMLElement, binding: TooltipVNodeDirective) {
  const { value = '', modifiers } = binding;

  if (value === false) return;

  const options = isObject(value)
    ? value as TooltipOptions
    : { text: value };

  (el as any).vTooltip = createTooltip(el, {
    ...modifiers,
    ...options,
  });
}

function unbind(el: HTMLElement) {
  const { vTooltip } = el as any;

  if (!vTooltip) return;

  vTooltip.destroy();

  delete (el as any).vTooltip;
}

function update(el: HTMLElement, binding: TooltipVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (value === false) {
    unbind(el);
    return;
  }

  const { vTooltip } = (el as any);

  vTooltip.tooltip.text = binding.value;
}

export const vTooltip = defineDirective({
  name : 'tooltip',
  inserted,
  unbind,
  update,
});

export default vTooltip;
