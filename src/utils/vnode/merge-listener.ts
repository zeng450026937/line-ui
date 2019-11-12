type Listener = { [key: string]: Function | Function[] }

export function mergeListener(exist: Listener, value: Listener): Listener {
  const listener: Listener = { ...exist };
  // eslint-disable-next-line
  for (const key in value) {
    const old = exist[key];
    const val = value[key];
    listener[key] = old ? ([] as Array<Function>).concat(old, val) : val;
  }

  return listener;
}
