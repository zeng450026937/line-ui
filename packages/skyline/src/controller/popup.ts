import { Popup } from 'skyline/src/components/popup';
import { createFactory } from 'skyline/src/controller/factory';
import { popupContext, PopupInterface } from 'skyline/src/utils/popup';

export class PopupController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Popup);
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
