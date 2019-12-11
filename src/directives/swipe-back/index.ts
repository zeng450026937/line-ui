import { VNodeDirective } from 'vue';
import { createSwipeBackGesture } from '@/utils/gesture/swipe-back';
import { NOOP, NO } from '@/utils/helpers';

interface SwipeBackVNodeDirective extends VNodeDirective {
  value?: {
    canStartHandler: () => boolean,
    onStartHandler: () => void,
    onMoveHandler: (step: number) => void,
    onEndHandler: (shouldComplete: boolean, step: number, dur: number) => void,
  }
}

function inserted(el: HTMLElement, binding: SwipeBackVNodeDirective) {
  if (!binding.value) return;

  const {
    canStartHandler = NO,
    onStartHandler = NOOP,
    onMoveHandler = NOOP,
    onEndHandler = NOOP,
  } = binding.value;

  (el as any).vSwipeBack = createSwipeBackGesture(
    el,
    canStartHandler,
    onStartHandler,
    onMoveHandler,
    onEndHandler,
  );
}

function unbind(el: HTMLElement) {
  if (!(el as any).vSwipeBack) return;
  (el as any).vSwipeBack.destroy();
  delete (el as any).vSwipeBack;
}

function update(el: HTMLElement, binding: SwipeBackVNodeDirective) {
  if (binding.value === binding.oldValue) return;
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const SwipeBack = {
  inserted,
  unbind,
  update,
};

export default SwipeBack;
