
export type CompareFunc<T> = (val: T, wanted: any, index?: number) => number;

export const DefaultCompare: CompareFunc<any> = (val, wanted) => (
  val < wanted
    ? -1
    : val > wanted
      ? 1
      : 0
);

/**
 * @param array sorted array with compare func
 * @param wanted search item
 * @param compare (optional) custom compare func
 * @param from (optional) start index
 * @param to (optional) exclusive end index
 * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
 */
export function binarySearch<T = any>(
  array: Array<T> = [],
  wanted: any,
  compare: CompareFunc<T> = DefaultCompare,
  from: number = 0,
  to: number = array.length - 1,
  bound: number = 0,
): number {
  if (from >= to) return to;
  const initFrom = from;
  const initTo = to;

  let mid = 0;
  let result = 0;
  let found = -1;

  /* eslint-disable no-continue */
  while (from <= to) {
    /* eslint-disable-next-line */
    mid = from + to >>> 1;
    try {
      result = compare(array[mid], wanted, mid);
    } catch (e) {
      console.log(initFrom, initTo, mid, to);
      throw e;
    }
    if (result < 0) {
      from = mid + 1;
      continue;
    }
    if (result > 0) {
      to = mid - 1;
      continue;
    }
    found = mid;
    if (bound < 0) {
      to = mid - 1;
      continue;
    }
    if (bound > 0) {
      from = mid + 1;
      continue;
    }
    return mid;
  }
  if (found < 0) {
    console.log(initFrom, initTo, mid, to);
    debugger;
  }

  return found >= 0 ? found : to;
}
