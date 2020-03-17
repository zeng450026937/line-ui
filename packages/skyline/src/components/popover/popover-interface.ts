import {
  AnimationBuilder,
  Mode,
} from 'skyline/src/types/interface';

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
