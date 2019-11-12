import Vue from 'vue';
import { Overlay } from '@/components/overlay';

let lastId = 0;

type OverlayInstance = {
  overlayIndex: number;
}

export function prepareOverlay(instance: OverlayInstance) {
  const overlayIndex = lastId++;
  instance.overlayIndex = overlayIndex;
}

export function createOverlay() {
  const overlay = new Overlay();

  overlay.$mount();

  const parent = document.querySelector('[data-app]');

  parent && parent.appendChild(overlay.$el);
}
