import { CompareFunc, binarySearch } from './binary-search';

export function exponentialSearch<T>(
  array: Array<T> = [],
  wanted: T,
  compare: CompareFunc<T>,
  from: number,
  to: number,
  bound: number,
): number {
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
