import { ToolTip } from '@/components/tooltip';
import { createFactory } from '@/controller/factory';
import { popupContext, PopupInterface } from '@/utils/popup';

export class TooltipController {
  private factory: ReturnType<typeof createFactory>;

  constructor() {
    this.factory = createFactory(ToolTip);
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
