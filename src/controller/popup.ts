/* eslint-disable-next-line import/extensions */
import { VueConstructor } from 'vue/types/vue';

export interface PopupContent {
  component: VueConstructor;
  props: object;
}

export class PopupController {
  open() {}
  close() {}
}
