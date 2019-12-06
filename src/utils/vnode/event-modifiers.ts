/* eslint-disable consistent-return */
export function condition(fn: Function, cond?: Function) {
  return (...args: any[]) => {
    if (cond && cond(...args) === false) return;
    return fn(...args);
  };
}

export function stop(fn: Function) {
  return (event: UIEvent, ...args: any[]) => {
    event.stopPropagation();
    return fn(event, ...args);
  };
}
export function prevent(fn: Function) {
  return (event: UIEvent, ...args: any[]) => {
    event.preventDefault();
    return fn(event, ...args);
  };
}
export function self(fn: Function) {
  return (event: UIEvent, ...args: any[]) => {
    if (event.target !== event.currentTarget) return;
    return fn(event, ...args);
  };
}

export function keyCode(fn: Function, code: number | string) {
  return (event: KeyboardEvent, ...args: any[]) => {
    if (event.keyCode !== code) return;
    return fn(event, ...args);
  };
}
export function ctrlKey(fn: Function) {
  return (event: KeyboardEvent, ...args: any[]) => {
    if (!event.ctrlKey) return;
    return fn(event, ...args);
  };
}
export function altKey(fn: Function) {
  return (event: KeyboardEvent, ...args: any[]) => {
    if (!event.altKey) return;
    return fn(event, ...args);
  };
}
export function shiftKey(fn: Function) {
  return (event: KeyboardEvent, ...args: any[]) => {
    if (!event.shiftKey) return;
    return fn(event, ...args);
  };
}
export function metaKey(fn: Function) {
  return (event: KeyboardEvent, ...args: any[]) => {
    if (!event.metaKey) return;
    return fn(event, ...args);
  };
}

export function leftButton(fn: Function) {
  return (event: MouseEvent, ...args: any[]) => {
    if ('button' in event && event.button !== 0) return;
    return fn(event, ...args);
  };
}
export function middleButton(fn: Function) {
  return (event: MouseEvent, ...args: any[]) => {
    if ('button' in event && event.button !== 1) return;
    return fn(event, ...args);
  };
}
export function rightButton(fn: Function) {
  return (event: MouseEvent, ...args: any[]) => {
    if ('button' in event && event.button !== 2) return;
    return fn(event, ...args);
  };
}

export function modifier(fn: Function) {
  let final = fn;
  return {
    condition(cond?: Function) {
      final = condition(fn, cond);
      return this;
    },
    stop() {
      final = stop(final);
      return this;
    },
    prevent() {
      final = prevent(final);
      return this;
    },
    self() {
      final = self(final);
      return this;
    },
    key(code: number | string) {
      final = keyCode(final, code);
      return this;
    },
    ctrl() {
      final = ctrlKey(final);
      return this;
    },
    alt() {
      final = altKey(final);
      return this;
    },
    shift() {
      final = shiftKey(final);
      return this;
    },
    meta() {
      final = metaKey(final);
      return this;
    },
    left() {
      final = leftButton(final);
      return this;
    },
    middle() {
      final = leftButton(final);
      return this;
    },
    right() {
      final = leftButton(final);
      return this;
    },

    get value() {
      return final;
    },
  };
}
