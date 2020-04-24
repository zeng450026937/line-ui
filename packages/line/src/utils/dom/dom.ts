export function append(target: Node, node: Node) {
  target.appendChild(node);
}

export function insert(target: Node, node: Node, anchor?: Node) {
  target.insertBefore(node, anchor || null);
}

export function detach(node: Node) {
  node.parentNode!.removeChild(node);
}

export function element<K extends keyof HTMLElementTagNameMap>(name: K) {
  return document.createElement<K>(name);
}

export function listen(
  node: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | EventListenerOptions
) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
