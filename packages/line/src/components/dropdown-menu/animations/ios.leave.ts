import {
  Animation,
  createAnimation,
} from '@line-ui/line/src/utils/animation';

/**
 * iOS Popover Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const { style } = baseEl;

  let transformY = 'translateY(-100%)';
  if (style && (!style.top && style.bottom)) {
    transformY = 'translateY(100%)';
  }

  backdropAnimation
    .addElement(baseEl.querySelector('.line-overlay')!)
    .fromTo('opacity', 'var(--backdrop-opacity)', 0);

  wrapperAnimation
    .addElement(baseEl.querySelector('.line-dropdown-menu__wrapper')!)
    .fromTo('transform', 'translateY(0%)', transformY);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(450)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
