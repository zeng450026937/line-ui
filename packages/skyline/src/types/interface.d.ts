// Types from utils
export { Animation, AnimationBuilder } from 'skyline/utils/animation/animation-interface';
export * from 'skyline/utils/popup';
export * from 'skyline/utils/config';
export { Gesture, GestureConfig, GestureDetail } from 'skyline/utils/gesture';

export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time';
export type Side = 'start' | 'end';
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;
export type Mode = 'ios' | 'md';
export type ComponentTags = string;
export type ComponentProps<T = null> = {[key: string]: any};
export type CssClassMap = { [className: string]: boolean };
export type BackButtonEvent = CustomEvent<BackButtonEventDetail>;

export interface BackButtonEventDetail {
  register(priority: number, handler: () => Promise<any> | void): void;
}

export interface StyleEventDetail {
  [styleName: string]: boolean;
}
