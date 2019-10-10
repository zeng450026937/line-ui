import { binarySearch } from './binary-search';

export function exponentialSearch(
  array = [],
  wanted,
  compare,
  from,
  to,
  bound,
) {
  let result = -1;
  let index = from;
  let interval = 1;
  while (
    index < to
    && result < 0
  ) {
    result = compare(array[index], wanted, index);
    index += interval;
    interval *= 2;
  }

  return binarySearch(
    array, wanted, compare, Math.floor(index / 2), index, bound,
  );
}
