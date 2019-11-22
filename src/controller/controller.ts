import Vue from 'vue';

const getAppRoot = (doc: Document = document) => {
  return doc.querySelector('[line-app]') || doc.body;
};

export function createController(sfc: any) {
  const stack = [] as Array<any>;
  const Component = Vue.extend(sfc);

  function create(options: any) {
    const instance = new Component({
      propsData : options,
    }).$mount();
    stack.push(instance);
    getAppRoot().appendChild(instance.$el);
    return instance;
  }

  function destroy(instance?: any) {
    if (instance) {
      instance.$el.remove();
      instance.$destroy();
      stack.splice(stack.indexOf(instance), 1);
    } else {
      const top = stack[stack.length - 1];
      if (!top) return;
      destroy(top);
    }
  }

  return {
    create,
    destroy,
  };
}
