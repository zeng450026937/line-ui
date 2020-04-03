import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';

/**
 * MD Toast Enter Animation
 */
export const mdEnterAnimation = (
  baseEl: HTMLElement,
  position: string
): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const wrapperEl = baseEl.querySelector('.line-toast__wrapper') as HTMLElement;

  const bottom = 'calc(8px + var(--line-safe-area-bottom, 0px))';
  const top = 'calc(8px + var(--line-safe-area-top, 0px))';

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperEl.style.top = top;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    case 'middle':
      /* eslint-disable-next-line */
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2
      );
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperEl.style.bottom = bottom;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
  }
  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation(wrapperAnimation);
};
