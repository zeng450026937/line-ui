import { Toast } from 'skyline/components/toast';
import { createFactory } from 'skyline/controller/factory';
import { popupContext, PopupInterface } from 'skyline/utils/popup';

export class ToastController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Toast);
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
