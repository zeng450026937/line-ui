/* eslint-disable-next-line */
import { AnimationBuilder, Mode } from 'skyline/types/interface';
import { SpinnerTypes } from 'skyline/components/spinner/spinner-configs';

export interface LoadingOptions {
  spinner?: SpinnerTypes | null;
  message?: string;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;
  backdropDismiss?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
