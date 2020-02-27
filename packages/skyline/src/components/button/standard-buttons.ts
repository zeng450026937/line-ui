export type ButtonRole =
 | 'accept'
 | 'reject'
 | 'destructive'
 | 'apply'
 | 'reset'
 | 'help'
 | 'yes'
 | 'no';

export interface Icon {
  name?: string;
  source?: string;
  width?: number;
  height?: number;
  color?: string;
}

export interface Class {
  [className: string]: boolean;
}

export interface Style {
  [styleName: string]: boolean;
}

export interface ButtonConfig {
  text?: string;
  icons?: string | Icon;
  side?: 'start' | 'end';
  role?: ButtonRole | string;
  shortcut?: string;
  checkable?: boolean;
  checked?: boolean;
  enabled?: boolean;
  handler?: () => boolean | void;
  //
  class?: Class;
  style?: Style;
}

export interface ButtonConfigs {
  [spinnerName: string]: ButtonConfig;
}

const buttons = {

  ok : {
    text : 'ok',
    role : 'accept',
  },

  open : {
    text : 'open',
    role : 'accept',
  },

  save : {
    text : 'save',
    role : 'accept',
  },

  cancel : {
    text : 'cancel',
    role : 'reject',
  },

  close : {
    text : 'close',
    role : 'reject',
  },

  discard : {
    text : 'discard',
    role : 'destructive',
  },

  apply : {
    text : 'apply',
    role : 'accept',
  },

  reset : {
    text : 'reset',
    role : 'reject',
  },

  restoreDefaults : {
    text : 'restore defaults',
    role : 'reject',
  },

  help : {
    text : 'help',
    role : 'help',
  },

  saveAll : {
    text : 'save all',
    role : 'accept',
  },

  yes : {
    text : 'yes',
    role : 'yes',
  },

  yesToAll : {
    text : 'yes to all',
    role : 'yes',
  },

  no : {
    text : 'no',
    role : 'no',
  },

  noToAll : {
    text : 'no to all',
    role : 'no',
  },

  abort : {
    text : 'abort',
    role : 'reject',
  },

  retry : {
    text : 'retry',
    role : 'accept',
  },

  ignore : {
    text : 'ignore',
    role : 'accept',
  },

};

export const BUTTONS: ButtonConfigs = buttons;
export type ButtonTypes = keyof typeof buttons;
