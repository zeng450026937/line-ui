import { createAnimation, Animation } from '@/utils/animation';

/**
 * MD Action Sheet Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');

  wrapperAnimation
    .addElement(baseEl.querySelector('.line-action-sheet__wrapper')!)
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
