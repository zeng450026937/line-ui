/* eslint-disable-next-line */
import { GestureDetail } from 'skyline/types/interface';

export interface ScrollBaseDetail {
  isScrolling: boolean;
}

export interface ScrollDetail extends GestureDetail, ScrollBaseDetail {
  scrollTop: number;
  scrollLeft: number;
}

export type ScrollCallback = (detail?: ScrollDetail) => boolean | void;
