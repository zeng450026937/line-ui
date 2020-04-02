import {
  Animation,
  createAnimation,
} from '@line-ui/line/src/utils/animation';

/**
 * iOS Popover Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();

  return baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(500)
    .fromTo('opacity', 0.99, 0);
};
