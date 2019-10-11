import { binarySearch } from './binary-search';

export function exponentialSearch(
  array = [],
  wanted,
  compare,
  from,
  to,
  bound,
) {
  let index = from;
  let interval = 1;
  while (
    index < to
    && compare(array[index], wanted, index) < 0
  ) {
    index += interval;
    interval *= 2;
  }

  return binarySearch(
    array, wanted, compare, Math.floor(index / 2), Math.min(index, to), bound,
  );
}
