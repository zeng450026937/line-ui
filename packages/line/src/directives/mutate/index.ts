import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { isObject } from '@line-ui/line/src/utils/helpers';

export type MutateHandler = (
  mutationsList: MutationRecord[],
  observer: MutationObserver,
) => void;

export interface MutateOptions extends MutationObserverInit {
  handler: MutateHandler;
  once?: boolean;
}

export function createMutate(el: HTMLElement, options: MutateOptions) {
  const {
    handler,
    once,
    // Defaults to everything on
    attributes = true,
    childList = true,
    subtree = true,
    characterData = true,
  } = options;

  const observer = new MutationObserver(
    (
      mutationsList: MutationRecord[],
      observer: MutationObserver,
    ) => {
      handler(mutationsList, observer);

      // If has the once modifier, unbind
      if (once) {
      /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        destroy();
      }
    },
  );

  const destroy = () => {
    observer.disconnect();
  };

  observer.observe(el, {
    attributes,
    childList,
    subtree,
    characterData,
  });

  return {
    observer,
    destroy,
  };
}

export interface MutateVNodeDirective extends VNodeDirective {
  value?: MutateOptions | MutateHandler;
  modifiers: { [key: string]: boolean };
}

function inserted(el: HTMLElement, binding: MutateVNodeDirective) {
  const { value, modifiers } = binding;

  if (!value) return;

  const options = isObject(value)
    ? value as MutateOptions
    : { handler: value } as MutateOptions;

  // alias for MutationObserverInit
  const {
    attr: attributes = true,
    child: childList = true,
    sub: subtree = true,
    char: characterData = true,
    once,
  } = modifiers;

  (el as any).vMutate = createMutate(el, {
    attributes,
    childList,
    subtree,
    characterData,
    once,
    ...options,
  });
}

function unbind(el: HTMLElement) {
  const { vMutate } = el as any;

  if (!vMutate) return;

  vMutate.destroy();

  delete (el as any).vMutate;
}

function update(el: HTMLElement, binding: MutateVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vMutate = /*#__PURE__*/ defineDirective({
  name : 'mutate',
  inserted,
  unbind,
  update,
});

export default vMutate;
