import { Animation, createAnimation } from 'skyline/utils/animation';

/**
 * md Toast Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const wrapperEl = baseEl.querySelector('.line-toast__wrapper') as HTMLElement;

  wrapperAnimation
    .addElement(wrapperEl)
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .addAnimation(wrapperAnimation);
};
