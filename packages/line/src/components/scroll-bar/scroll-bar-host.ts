function createEventHandle(name, delegate) {
  return function eventHandle(event) {
    const fn = delegate && delegate[name];
    if (fn) {
      fn(event);
    }
  };
}

export class ScrollBarHost {
  constructor(element) {
    this.element = element;
    this.element.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.scrollWidth = this.element.scrollWidth;
    this.scrollHeight = this.element.scrollHeight;
  };

  destroy() {
    this.element.removeEventListener('scroll', this.onScroll);
  }
}
