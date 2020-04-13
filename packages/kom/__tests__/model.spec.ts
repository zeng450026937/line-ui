import { Model, nextTick } from '../src/model';

describe('kom/model', () => {
  test('init', async () => {
    const model = new Model();
    expect(model.store).toBeUndefined();
    model.init();
    expect(model.store).toBeTruthy();
  });

  test('provide with key/value', async () => {
    const model = new Model();
    model.provide('key', 'value');
    model.init();
    expect(model.store!.key).toBe('value');
  });

  test('provide with middleware', async () => {
    const model = new Model();
    const midSpy = jest.fn(async () => {});
    model.provide({
      middleware: {
        mid: midSpy,
      },
    });
    model.init();
    await model.dispatch('mid');
    expect(midSpy).toBeCalled();
  });

  test('model tree', async () => {
    const root = new Model();
    const child1 = new Model();
    const child2 = new Model();
    const child3 = new Model();
    child2.model('child', child3);
    root.model('child1', child1);
    root.model('child2', child2);
    root.init();

    expect(root.getModel('child1')).toBeDefined();
    expect(root.getModel('child2')).toBeDefined();
    expect(root.getModel('child3')).toBeUndefined();
    expect(root.getModel('child2/child')).toBeDefined();

    expect(root.getStore('child1')).toBeDefined();
    expect(root.getStore('child2')).toBeDefined();
    expect(root.getStore('child3')).toBeUndefined();
    expect(root.getStore('child2/child')).toBeDefined();

    expect(child2.getModel('child')).toBeDefined();
    expect(child2.getStore('child')).toBeDefined();
  });

  test('model tree with middleware', async () => {
    const middleware = {
      mid: jest.fn(async (ctx, next) => {
        await next();
      }),
    };
    const midSpy = jest.fn(async (ctx, next) => {
      await next();
    });
    const root = new Model();
    root.use(midSpy);
    root.provide({ middleware });

    const child1 = new Model();
    child1.use(midSpy);
    child1.provide({ middleware });

    const child2 = new Model();
    child2.use(midSpy);
    child2.provide({ middleware });

    const child3 = new Model();
    child3.use(midSpy);
    child3.provide({ middleware });

    child2.model('child3', child3);
    root.model('child1', child1);
    root.model('child2', child2);
    root.init();

    await root.dispatch('mid');
    expect(midSpy).toBeCalledTimes(1);
    expect(middleware.mid).toBeCalledTimes(1);
    midSpy.mockClear();
    middleware.mid.mockClear();

    await root.dispatch('child1/mid');
    expect(midSpy).toBeCalledTimes(2);
    expect(middleware.mid).toBeCalledTimes(1);
    midSpy.mockClear();
    middleware.mid.mockClear();

    await root.dispatch('child2/mid');
    expect(midSpy).toBeCalledTimes(2);
    expect(middleware.mid).toBeCalledTimes(1);
    midSpy.mockClear();
    middleware.mid.mockClear();

    await root.dispatch('child2/child3/mid');
    expect(midSpy).toBeCalledTimes(3);
    expect(middleware.mid).toBeCalledTimes(1);
    midSpy.mockClear();
    middleware.mid.mockClear();

    await root.dispatch('child3/mid');
    expect(midSpy).toBeCalledTimes(1);
    expect(middleware.mid).toBeCalledTimes(0);
  });

  test('model is isolated by mounting', async () => {
    const mid1 = {
      mid: jest.fn(async (ctx, next) => {
        await next();
      }),
    };
    const mid2 = {
      mid: jest.fn(async (ctx, next) => {
        await next();
      }),
    };
    const mid3 = {
      mid: jest.fn(async (ctx, next) => {
        await next();
      }),
    };
    const tree1 = new Model();
    tree1.provide({ middleware: mid1 });
    const tree2 = new Model();
    tree2.provide({ middleware: mid2 });
    const model = new Model();
    model.provide({ middleware: mid3 });

    tree2.model('child', model);
    tree1.mount('child', tree2);
    expect(tree2.parent).toBeUndefined();

    tree1.init();

    await tree1.dispatch('mid');
    expect(mid1.mid).toBeCalledTimes(1);

    await tree1.dispatch('child/mid');
    expect(mid1.mid).toBeCalledTimes(1);
    expect(mid2.mid).toBeCalledTimes(1);

    await tree2.dispatch('mid');
    expect(mid1.mid).toBeCalledTimes(1);
    expect(mid2.mid).toBeCalledTimes(2);

    await tree2.dispatch('child/mid');
    expect(mid1.mid).toBeCalledTimes(1);
    expect(mid2.mid).toBeCalledTimes(2);
    expect(mid3.mid).toBeCalledTimes(1);

    await model.dispatch('mid');
    expect(mid1.mid).toBeCalledTimes(1);
    expect(mid2.mid).toBeCalledTimes(2);
    expect(mid3.mid).toBeCalledTimes(2);
  });

  test('hook', async () => {
    const preHookSpy = jest.fn(() => {});
    const postHookSpy = jest.fn(() => {});
    const model = new Model();
    model.provide('key', 'value');
    model.hook('key', preHookSpy);
    model.init();

    model.store!.key = 'pre';
    await nextTick();
    expect(preHookSpy).toBeCalled();

    model.hook('key', postHookSpy);

    model.store!.key = 'post';
    await nextTick();
    expect(preHookSpy).toBeCalledTimes(2);
    expect(postHookSpy).toBeCalled();
  });

  test('broadcast/subscribe', async () => {
    const subscribeSpy = jest.fn(() => {});
    const model = new Model();
    model.init();
    model.subscribe('sub', subscribeSpy);
    model.broadcast('sub');
    expect(subscribeSpy).toBeCalled();
  });

  test('broadcast/subscribe with submodule', async () => {
    const subscribeSpy = jest.fn(() => {});
    const model = new Model();
    const submodule = new Model();
    model.model('child', submodule);
    model.init();
    model.subscribe('sub', subscribeSpy);
    submodule.subscribe('sub', subscribeSpy);

    model.broadcast('sub');
    expect(subscribeSpy).toBeCalledTimes(2);

    submodule.broadcast('sub');
    expect(subscribeSpy).toBeCalledTimes(4);
  });
});
