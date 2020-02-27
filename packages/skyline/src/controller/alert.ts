import { Alert } from 'skyline/components/alert';
import { createFactory } from 'skyline/controller/factory';
import { popupContext, PopupInterface } from 'skyline/utils/popup';

export class AlertController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Alert);
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
