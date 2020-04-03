import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { createSwipeBackGesture } from '@line-ui/line/src/utils/gesture/swipe-back';
import { NO, NOOP } from '@line-ui/line/src/utils/helpers';

export interface SwipeBackVNodeDirective extends VNodeDirective {
  value?: {
    canStartHandler: () => boolean;
    onStartHandler: () => void;
    onMoveHandler: (step: number) => void;
    onEndHandler: (shouldComplete: boolean, step: number, dur: number) => void;
  };
}

function inserted(el: HTMLElement, binding: SwipeBackVNodeDirective) {
  const { value } = binding;

  if (!value) return;

  const {
    canStartHandler = NO,
    onStartHandler = NOOP,
    onMoveHandler = NOOP,
    onEndHandler = NOOP,
  } = value;

  (el as any).vSwipeBack = createSwipeBackGesture(
    el,
    canStartHandler,
    onStartHandler,
    onMoveHandler,
    onEndHandler
  );
}

function unbind(el: HTMLElement) {
  const { vSwipeBack } = el as any;

  if (!vSwipeBack) return;

  vSwipeBack.destroy();

  delete (el as any).vSwipeBack;
}

function update(el: HTMLElement, binding: SwipeBackVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vSwipeBack = /*#__PURE__*/ defineDirective({
  name: 'swipe-back',
  inserted,
  unbind,
  update,
});

export default vSwipeBack;
