import { createAnimation, Animation } from '@/utils/animation';

/**
 * md Toast Leave Animation
 */
export const mdLeaveAnimation = (baseEl: ShadowRoot): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.line-toast__wrapper') as HTMLElement;

  wrapperAnimation
    .addElement(wrapperEl)
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .addAnimation(wrapperAnimation);
};
