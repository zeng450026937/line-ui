import { Popover } from '@/components/popover';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class PopoverController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(Popover);
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
