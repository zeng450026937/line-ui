/* eslint-disable consistent-return */
function parallel(pool = [], concurrency = 8, pipe = false) {
  if (pool.length === 0) return;

  const result = [];

  let finished = 0;

  let index = 0;

  concurrency = Math.min(concurrency, pool.length);

  async function maybeNext(resolve, reject, flushed) {
    const cusor = index;
    const next = pool.length < index ? null : pool[index];

    if (finished === pool.length) resolve(pipe ? result[finished - 1] : result);
    if (!next) return;

    index++;

    flushed = result[cusor] = pipe ? await next(flushed) : await next();

    finished++;

    maybeNext(resolve, reject, flushed);
  }

  return new Promise((resolve, reject) => {
    while (concurrency > 0) {
      maybeNext(resolve, reject);
      concurrency--;
    }
  });
}

function series(pool) {
  return parallel(pool, 1, false);
}

function waterfall(pool) {
  return parallel(pool, 1, true);
}

module.exports = {
  parallel, series, waterfall,
};
