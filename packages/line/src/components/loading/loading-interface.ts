import { Mode } from '@line-ui/line/src/types';
import { AnimationBuilder } from '@line-ui/line/src/utils/animation';
import { SpinnerTypes } from '@line-ui/line/src/components/spinner/spinner-configs';

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
