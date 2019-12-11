import { Alert } from '@/components/alert';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class LoadingController {
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
