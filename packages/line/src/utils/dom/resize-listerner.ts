import { element, append, detach } from './dom';
import { on } from './event-listener';

export function addResizeListener(node: HTMLElement, fn: () => void) {
  if (getComputedStyle(node).position === 'static') {
    node.style.position = 'relative';
  }

  const object = element('object');
  object.setAttribute(
    'style',
    'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;'
  );
  object.setAttribute('aria-hidden', 'true');
  object.type = 'text/html';
  object.tabIndex = -1;

  let off: () => void;

  object.onload = () => {
    off = on(object.contentDocument!.defaultView!, 'resize', fn);
  };

  if (/Trident/.test(navigator.userAgent)) {
    append(node, object);
    object.data = 'about:blank';
  } else {
    object.data = 'about:blank';
    append(node, object);
  }

  return () => {
    detach(object);
    off && off();
  };
}

// TBD
// support crossorigin
/*
let crossorigin: boolean | undefined;

export function isCrossorigin() {
  if (crossorigin === undefined) {
    crossorigin = false;

    try {
      if (typeof window !== 'undefined' && window.parent) {
        // eslint-disable-next-line
        void window.parent.document;
      }
    } catch (error) {
      crossorigin = true;
    }
  }

  return crossorigin;
}

export function addResizeListener(node: HTMLElement, fn: () => void) {
  const computedStyle = getComputedStyle(node);
  const zIndex = (parseInt(computedStyle.zIndex) || 0) - 1;

  if (computedStyle.position === 'static') {
    node.style.position = 'relative';
  }

  const iframe = element('iframe');
  iframe.setAttribute(
    'style',
    `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
      `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${zIndex};`
  );
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;

  let off: () => void;

  if (isCrossorigin()) {
    iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
    off = on(window, 'message', (event: Event) => {
      if ((event as MessageEvent).source === iframe.contentWindow) fn();
    });
  } else {
    iframe.src = 'about:blank';
    iframe.onload = () => {
      off = on(iframe.contentWindow!, 'resize', fn);
    };
  }

  append(node, iframe);

  return () => {
    detach(iframe);
    if (off) off();
  };
}
*/
