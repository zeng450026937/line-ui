import { Popover } from 'skyline/src/components/popover';
import { createFactory } from 'skyline/src/controller/factory';
import { popupContext, PopupInterface } from 'skyline/src/utils/popup';

export class PopoverController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Popover);
  }

  create(props?: any, destroyWhenClose?: boolean): PopupInterface {
    return this.factory.create(props, destroyWhenClose) as any;
  }

  close(reason?: string) {
    const lastPopup = this.getTop();
    lastPopup && lastPopup.close(reason);
  }

  /* eslint-disable-next-line class-methods-use-this */
  getTop(): PopupInterface {
    return popupContext.getPopup();
  }
}
