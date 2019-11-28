/* eslint-disable-next-line */
import { AnimationBuilder, Mode } from '@/types/interface';
import { SpinnerTypes } from '@/components/spinner/spinner-configs';

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
