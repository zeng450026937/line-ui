import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';

/**
 * iOS Toast Leave Animation
 */
export const iosLeaveAnimation = (
  baseEl: HTMLElement,
  position: string
): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const wrapperEl = baseEl.querySelector('.line-toast__wrapper') as HTMLElement;

  const bottom = 'calc(-10px - var(--line-safe-area-bottom, 0px))';
  const top = 'calc(10px + var(--line-safe-area-top, 0px))';

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo(
        'transform',
        `translateY(${top})`,
        'translateY(-100%)'
      );
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo(
        'transform',
        `translateY(${bottom})`,
        'translateY(100%)'
      );
      break;
  }
  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .addAnimation(wrapperAnimation);
};
