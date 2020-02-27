import { Animation, createAnimation } from 'skyline/utils/animation';

/**
 * iOS Modal Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const wrapperEl = baseEl.querySelector('.line-popup__wrapper');
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);

  wrapperAnimation
    .addElement(wrapperEl!)
    .beforeStyles({ opacity: 1 })
    .fromTo('transform', 'translateY(0%)', `translateY(${ (baseEl.ownerDocument as any).defaultView.innerHeight - wrapperElRect.top }px)`);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(250)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
