import { AnimationBuilder } from 'skyline/types/interface.d';
import { MenuI } from './menu-interface';
import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';

const createMenuController = () => {
  const menuAnimations = new Map<string, AnimationBuilder>();
  const menus: MenuI[] = [];

  const waitUntilReady = () => {
    return Promise.all(
      Array.from(document.querySelectorAll('.line-menu'))
        .map(menu => {
          // menu.componentOnReady()
          // TODO
          console.log(menu);
          return true;
        }),
    );
  };

  const getMenusSync = (): any[] => {
    return menus.map(menu => menu.el);
  };

  const isAnimatingSync = (): boolean => {
    return menus.some(menu => menu.isAnimating);
  };

  const _setActiveMenu = (menu: MenuI) => {
    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const { side } = menu;
    menus
      .filter(m => m.side === side && m !== menu)
      .forEach(m => m.disabled = true);
  };

  const find = (predicate: (menu: MenuI) => boolean): any | undefined => {
    const instance = menus.find(predicate);
    if (instance !== undefined) {
      return instance.el;
    }
    return undefined;
  };

  const get = async (menu?: string | null): Promise<any | undefined> => {
    await waitUntilReady();
    if (menu === 'start' || menu === 'end') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      const menuRef = find(m => m.side === menu && !m.disabled);
      console.log('menuRef', menuRef);
      if (menuRef) {
        return menuRef;
      }

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      console.log('find', find(m => m.side === menu));

      return find(m => m.side === menu);
    }
    if (menu != null) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      return find(m => m.menuId === menu);
    }

    // return the first enabled menu
    const menuEl = find(m => !m.disabled);
    if (menuEl) {
      return menuEl;
    }
    // get the first menu in the array, if one exists
    return menus.length > 0 ? menus[0] : undefined;
  };

  const _getOpenSync = (): any | undefined => {
    return find(m => m._isOpen);
  };

  /**
   * Get the instance of the opened menu. Returns `null` if a menu is not found.
   */
  const getOpen = async (): Promise<any | undefined> => {
    await waitUntilReady();
    return _getOpenSync();
  };

  const open = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu);
    if (menuEl) {
      return menuEl.open();
    }
    return false;
  };

  const close = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await (menu !== undefined ? get(menu) : getOpen());
    if (menuEl !== undefined) {
      return menuEl.close();
    }
    return false;
  };

  const toggle = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu);
    if (menuEl) {
      return menuEl.toggle();
    }
    return false;
  };

  const enable = async (shouldEnable: boolean, menu?: string | null): Promise<any | undefined> => {
    const menuEl = await get(menu);
    if (menuEl) {
      menuEl.disabled = !shouldEnable;
    }
    return menuEl;
  };

  const swipeGesture = async (shouldEnable: boolean, menu?: string | null): Promise<any | undefined> => {
    const menuEl = await get(menu);
    if (menuEl) {
      menuEl.swipeGesture = shouldEnable;
    }
    return menuEl;
  };


  const isEnabled = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu);
    if (menuEl) {
      return !menuEl.disabled;
    }
    return false;
  };


  const registerAnimation = (name: string, animation: AnimationBuilder) => {
    menuAnimations.set(name, animation);
  };

  const _register = (menu: MenuI) => {
    console.log('menu', menu);
    if (menus.indexOf(menu) < 0) {
      if (!menu.disabled) {
        _setActiveMenu(menu);
      }
      menus.push(menu);
    }

    console.log(menus);
  };

  const _unregister = (menu: MenuI) => {
    const index = menus.indexOf(menu);
    if (index > -1) {
      menus.splice(index, 1);
    }
  };


  const _createAnimation = (type: string, menuCmp: MenuI) => {
    const animationBuilder = menuAnimations.get(type) as any;

    if (!animationBuilder) {
      throw new Error('animation not registered');
    }

    const animation = animationBuilder(menuCmp);
    return animation;
  };


  /**
   * Get all menu instances.
   */
  const getMenus = async (): Promise<any[]> => {
    await waitUntilReady();
    return getMenusSync();
  };

  const isOpen = async (menu?: string | null): Promise<boolean> => {
    if (menu != null) {
      const menuEl = await get(menu);
      return (menuEl !== undefined && menuEl.isOpen());
    }
    const menuEl = await getOpen();
    return menuEl !== undefined;
  };

  /**
   * Get whether or not a menu is animating. Returns `true` if any
   * menu is currently animating.
   */
  const isAnimating = async (): Promise<boolean> => {
    await waitUntilReady();
    return isAnimatingSync();
  };

  const _setOpen = async (menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean> => {
    if (isAnimatingSync()) {
      return false;
    }
    if (shouldOpen) {
      const openedMenu = await getOpen();
      if (openedMenu && menu.el !== openedMenu) {
        await openedMenu.setOpen(false, false);
      }
    }
    return menu._setOpen(shouldOpen, animated);
  };


  registerAnimation('reveal', menuRevealAnimation);
  registerAnimation('push', menuPushAnimation);
  registerAnimation('overlay', menuOverlayAnimation);

  return {
    registerAnimation,
    get,
    getMenus,
    getOpen,
    isEnabled,
    swipeGesture,
    isAnimating,
    isOpen,
    enable,
    toggle,
    close,
    open,
    _getOpenSync,
    _createAnimation,
    _register,
    _unregister,
    _setOpen,
    _setActiveMenu,
  };
};

export const menuController = /* @__PURE__ */createMenuController();
