import { Alert } from '@/components/alert';
import { createFactory } from '@/controller/factory';
import { getPopup, PopupInterface } from '@/utils/popup';

export class LoadingController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Alert);
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
    return getPopup();
  }
}