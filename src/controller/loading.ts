import { Loading } from '@/components/loading';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class LoadingController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Loading);
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
