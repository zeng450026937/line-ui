import { Animation } from 'skyline/src/types/interface';
import { createAnimation } from 'skyline/src/utils/animation/animation';

/**
 * iOS Picker Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay') as Element)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');

  wrapperAnimation
    .addElement(baseEl.querySelector('.picker-wrapper') as Element)
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
