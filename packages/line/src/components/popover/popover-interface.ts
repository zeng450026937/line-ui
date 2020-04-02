import { Mode } from '@line-ui/line/src/types';
import { AnimationBuilder } from '@line-ui/line/src/utils/animation';

export interface PopoverOptions {
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  translucent?: boolean;
  cssClass?: string | string[];
  event?: Event;
  animated?: boolean;

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
