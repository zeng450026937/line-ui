import { ActionSheet } from '@line-ui/line/src/components/action-sheet';
import { Alert } from '@line-ui/line/src/components/alert';
import { Loading } from '@line-ui/line/src/components/loading';
import { Picker } from '@line-ui/line/src/components/picker';
import { Popover } from '@line-ui/line/src/components/popover';
import { Popup } from '@line-ui/line/src/components/popup';
import { Toast } from '@line-ui/line/src/components/toast';
import { Tooltip } from '@line-ui/line/src/components/tooltip';

import { createController } from '@line-ui/line/src/controllers/factory';

export const ActionSheetController = /*#__PURE__*/ createController(ActionSheet);
export const AlertController = /*#__PURE__*/ createController(Alert);
export const LoadingController = /*#__PURE__*/ createController(Loading);
export const PickerController = /*#__PURE__*/ createController(Picker);
export const PopoverController = /*#__PURE__*/ createController(Popover);
export const PopupController = /*#__PURE__*/ createController(Popup);
export const ToastController = /*#__PURE__*/ createController(Toast);
export const TooltipController = /*#__PURE__*/ createController(Tooltip);
