import { AnimationBuilder } from '@line-ui/line/src/utils/animation';
import { MenuI } from '@line-ui/line/src/utils/menu-controller/menu-interface';
import { menuOverlayAnimation } from '@line-ui/line/src/utils/menu-controller/animations/overlay';
import { menuPushAnimation } from '@line-ui/line/src/utils/menu-controller/animations/push';
import { menuRevealAnimation } from '@line-ui/line/src/utils/menu-controller/animations/reveal';

const createMenuController = () => {
  const menuAnimations = new Map<string, AnimationBuilder>();

  const registerAnimation = (name: string, animation: AnimationBuilder) => {
    menuAnimations.set(name, animation);
  };

  const _createAnimation = (type: string, menuCmp: MenuI) => {
    const animationBuilder = menuAnimations.get(type) as any;

    if (!animationBuilder) {
      throw new Error('animation not registered');
    }

    const animation = animationBuilder(menuCmp);
    return animation;
  };

  registerAnimation('reveal', menuRevealAnimation);
  registerAnimation('push', menuPushAnimation);
  registerAnimation('overlay', menuOverlayAnimation);

  return {
    registerAnimation,
    _createAnimation,
  };
};

export const menuController = /* @__PURE__ */ createMenuController();
