import { Popup } from '@/components/popup';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class PopupController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Popup);
  }

  create(props?: any): PopupInterface {
    return this.factory.create(props) as any;
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
