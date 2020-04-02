import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';

/**
 * Md Modal Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');

  wrapperAnimation
    .addElement(baseEl.querySelector('.line-popup__wrapper')!)
    .keyframes([
      { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
      { offset: 1, opacity: 1, transform: 'translateY(0px)' },
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(280)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
