import { Layer } from '../src/layer';

describe('kom/layer', () => {
  test('dispatch with middleware', async () => {
    const layer = new Layer();
    const midSpy = jest.fn(async () => {});

    layer.use(midSpy);
    await layer.dispatch('any');

    expect(midSpy).toBeCalled();
  });

  test('dispatch with named middleware', async () => {
    let watcher = 0;
    const layer = new Layer();
    const middleware = async () => {
      watcher++;
    };
    layer.use('name', middleware);

    await layer.dispatch('any');
    expect(watcher).toBe(0);

    await layer.dispatch('name');
    expect(watcher).toBe(1);

    await layer.dispatch('name/');
    expect(watcher).toBe(2);
  });

  test('should stop without next()', async () => {
    const layer = new Layer();
    const mid1 = jest.fn(async (ctx, next) => {
      await next();
    });
    const mid2 = jest.fn(async () => {});
    const mid3 = jest.fn(async () => {});

    layer.use(mid1);
    layer.use(mid2);
    layer.use(mid3);

    await layer.dispatch('any');
    expect(mid1).toBeCalled();
    expect(mid2).toBeCalled();
    expect(mid3).toBeCalledTimes(0);
  });

  test('nested layer', async () => {
    const layer = new Layer();
    const mid = jest.fn(async () => {});
    layer.use(mid);

    const nested = new Layer();
    const nestedMid = jest.fn(async (ctx, next) => {
      await next();
    });
    nested.use(nestedMid);

    layer.use('nested', nested.callback());

    await layer.dispatch('nested');
  });
});
