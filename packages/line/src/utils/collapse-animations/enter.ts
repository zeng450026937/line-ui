import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';

/**
 * Enter Animation
 */
export const enterAnimation = (
  baseEl: HTMLElement,
  paddingTop: number,
  paddingBottom: number
): Animation => {
  const height = baseEl.scrollHeight || '';
  const baseAnimation = createAnimation();

  baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(300)
    // .afterClearStyles(['height'])
    .fromTo('padding-top', '0px', `${paddingTop}px`)
    .fromTo('padding-bottom', '0px', `${paddingBottom}px`)
    .fromTo('height', '0px', `${height}px`);

  return baseAnimation;
};
