import {
  hasOwn,
  isDef,
  isObject,
} from 'skyline/src/utils/helpers';

type ObjectIndex = Record<string, any>;

function assignKey(to: ObjectIndex, from: ObjectIndex, key: string) {
  const val = from[key];

  if (!isDef(val)) {
    return;
  }

  if (!hasOwn(to, key) || !isObject(val) || typeof val === 'function') {
    to[key] = val;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

export function deepAssign(to: ObjectIndex, from: ObjectIndex): ObjectIndex {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });

  return to;
}
