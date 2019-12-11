import { Animation, createAnimation } from '@/utils/animation';

/**
 * Md Modal Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const wrapperEl = baseEl.querySelector('.line-popup__wrapper')!;

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);

  wrapperAnimation
    .addElement(wrapperEl)
    .keyframes([
      { offset: 0, opacity: 0.99, transform: 'translateY(0px)' },
      { offset: 1, opacity: 0, transform: 'translateY(40px)' },
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.47,0,0.745,0.715)')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
