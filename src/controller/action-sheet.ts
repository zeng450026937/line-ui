import { ActionSheet } from '@/components/action-sheet';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class ActionSheetController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(ActionSheet);
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
