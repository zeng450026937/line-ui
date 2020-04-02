export class ScrollBarDelegate {
  constructor(element) {
    this.element = element;
    this.element.addEventListener('scroll', this.);
  }

  destroy() {
    this.element.removeEventListener('scroll', )
  }
}
