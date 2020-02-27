export type LazyCallback<T = any> = (flushed?: T) => Promise<T>;
export type LazyCallbacks<T = any> = LazyCallback<T>[];

export async function parallel<T = any>(pool: LazyCallbacks<T> = [], concurrency = 8, pipe = false) {
  if (pool.length === 0) return [];

  const result: any[] = [];

  let finished = 0;
  let index = 0;

  concurrency = Math.min(concurrency, pool.length);

  async function maybeNext(resolve: (value: T | T[]) => void, reject: (error: any) => void, flushed?: T) {
    const cusor = index;
    const next = pool.length < index ? null : pool[index];

    if (finished === pool.length) resolve(pipe ? result[finished - 1] : result);
    if (!next) return;

    index++;

    flushed = result[cusor] = pipe ? await next(flushed) : await next();

    finished++;

    maybeNext(resolve, reject, flushed);
  }

  const final = await new Promise<T | T[]>((resolve, reject) => {
    while (concurrency > 0) {
      maybeNext(resolve, reject);
      concurrency--;
    }
  });

  return final;
}

export function series(pool: LazyCallbacks) {
  return parallel(pool, 1, false);
}

export function waterfall(pool: LazyCallbacks) {
  return parallel(pool, 1, true);
}
