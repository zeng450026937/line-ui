import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';

/**
 * Leave Animation
 */
export const leaveAnimation = (
  baseEl: HTMLElement,
  paddingTop: number,
  paddingBottom: number
): Animation => {
  const height = baseEl.scrollHeight || '';
  const baseAnimation = createAnimation();

  baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(300)
    .fromTo('padding-top', `${paddingTop}px`, '0px')
    .fromTo('padding-bottom', `${paddingBottom}px`, '0px')
    .fromTo('height', `${height}px`, '0px');

  return baseAnimation;
};
