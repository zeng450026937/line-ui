import {
  Animation,
  createAnimation,
} from 'skyline/src/utils/animation';

/**
 * iOS Toast Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement, position: string): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const wrapperEl = baseEl.querySelector('.line-toast__wrapper') as HTMLElement;

  const bottom = 'calc(-10px - var(--line-safe-area-bottom, 0px))';
  const top = 'calc(10px + var(--line-safe-area-top, 0px))';

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', 'translateY(-100%)', `translateY(${ top })`);
      break;
    case 'middle':
      /* eslint-disable-next-line */
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2,
      );
      wrapperEl.style.top = `${ topPosition }px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('transform', 'translateY(100%)', `translateY(${ bottom })`);
      break;
  }
  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.155,1.105,.295,1.12)')
    .duration(400)
    .addAnimation(wrapperAnimation);
};
