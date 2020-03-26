import { ActionSheet } from 'skyline/src/components/action-sheet';
import { Alert } from 'skyline/src/components/alert';
import { Loading } from 'skyline/src/components/loading';
import { Picker } from 'skyline/src/components/picker';
import { Popover } from 'skyline/src/components/popover';
import { Popup } from 'skyline/src/components/popup';
import { Toast } from 'skyline/src/components/toast';
import { Tooltip } from 'skyline/src/components/tooltip';

import { createController } from 'skyline/src/controllers/factory';

export const ActionSheetController = /*#__PURE__*/ createController(ActionSheet);
export const AlertController = /*#__PURE__*/ createController(Alert);
export const LoadingController = /*#__PURE__*/ createController(Loading);
export const PickerController = /*#__PURE__*/ createController(Picker);
export const PopoverController = /*#__PURE__*/ createController(Popover);
export const PopupController = /*#__PURE__*/ createController(Popup);
export const ToastController = /*#__PURE__*/ createController(Toast);
export const TooltipController = /*#__PURE__*/ createController(Tooltip);
