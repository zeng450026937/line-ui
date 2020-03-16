import { Animation } from 'skyline/types/interface.d';
import { createAnimation } from 'skyline/src/utils/animation/animation';

/**
 * iOS Picker Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay') as Element)
    .fromTo('opacity', 'var(--backdrop-opacity)', 0.01);

  wrapperAnimation
    .addElement(baseEl.querySelector('.picker-wrapper') as Element)
    .fromTo('transform', 'translateY(0%)', 'translateY(100%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
