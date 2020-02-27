import { Animation } from 'skyline/types/interface.d';
import { MenuI } from '../menu-interface';
import { createAnimation } from 'skyline/utils/animation/animation';

import { baseAnimation } from './base';

/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export const menuRevealAnimation = (menu: MenuI): Animation => {
  const openedX = `${ menu.width * (menu.isEndSide ? -1 : 1) }px`;

  const contentOpen = createAnimation()
    .addElement(menu.contentEl!) // REVIEW
    .fromTo('transform', 'translateX(0px)', `translateX(${ openedX })`);

  return baseAnimation(menu.mode === 'ios').addAnimation(contentOpen);
};
