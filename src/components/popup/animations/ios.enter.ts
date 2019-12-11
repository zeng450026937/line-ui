import { Animation, createAnimation } from '@/utils/animation';

/**
 * iOS Modal Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');

  wrapperAnimation
    .addElement(baseEl.querySelector('.line-popup__wrapper')!)
    .beforeStyles({ opacity: 1 })
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
