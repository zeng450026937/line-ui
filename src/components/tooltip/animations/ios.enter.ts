import { Animation, createAnimation } from '@/utils/animation';

/**
 * iOS Tooltip Enter Animation
 */

export const iosEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();

  return baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(100)
    .fromTo('opacity', 0.01, 1);
};
