import { createAnimation, Animation } from '@/utils/animation';

/**
 * Md Loading Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');

  wrapperAnimation
    .addElement(baseEl.querySelector('.line-loading__wrapper')!)
    .keyframes([
      { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
      { offset: 1, opacity: 1, transform: 'scale(1)' },
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
