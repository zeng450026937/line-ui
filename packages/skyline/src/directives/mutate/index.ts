import { DirectiveOptions, VNodeDirective } from 'vue';
import { isObject } from 'skyline/utils/helpers';

interface MutateVNodeDirective extends VNodeDirective {
  options?: MutationObserverInit;
  value: MutateDirectiveValue | MutateDirectiveHandler;
}

type MutateDirectiveValue = {
  handler: MutateDirectiveHandler;
  options?: MutationObserverInit;
};

type MutateDirectiveHandler = (
  mutationsList: MutationRecord[],
  observer: MutationObserver,
) => void;

function inserted(el: HTMLElement, binding: MutateVNodeDirective) {
  if (!binding.value) return;

  const modifiers = binding.modifiers || {};
  const { value } = binding;
  const callback = isObject(value)
    ? (value as MutateDirectiveValue).handler
    : (value as MutateDirectiveHandler);
  const { once, ...modifierKeys } = modifiers;
  const hasModifiers = Object.keys(modifierKeys).length > 0;
  const hasOptions = !!(value as any).options;

  // Options take top priority
  const options = hasOptions ? (value as MutateDirectiveValue).options : hasModifiers
    // If we have modifiers, use only those provided
    ? {
      attributes    : modifierKeys.attr,
      childList     : modifierKeys.child,
      subtree       : modifierKeys.sub,
      characterData : modifierKeys.char,
    }
    // Defaults to everything on
    : {
      attributes    : true,
      childList     : true,
      subtree       : true,
      characterData : true,
    };

  const observer = new MutationObserver((
    mutationsList: MutationRecord[],
    observer: MutationObserver,
  ) => {
    if (!(el as any).vMutate) return; // Just in case, should never fire

    callback(mutationsList, observer);

    // If has the once modifier, unbind
    /* eslint-disable-next-line */
    once && unbind(el);
  });

  function destroy() {
    observer.disconnect();
  }

  (el as any).vMutate = {
    observer,
    destroy,
  };

  observer.observe(el, options);
}

function unbind(el: HTMLElement) {
  const { vMutate } = el as any;
  if (!vMutate) return;
  vMutate.destroy();
  delete (el as any).vMutate;
}

function update(el: HTMLElement, binding: MutateVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Mutate = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default Mutate;
