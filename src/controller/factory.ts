import Vue from 'vue';

const getAppRoot = (doc: Document = document) => {
  return doc.querySelector('[skyline-app]') || doc.body;
};

export function createFactory(sfc: any) {
  const Component = Vue.extend(sfc);

  function create(props: any, destroyWhenClose = true) {
    return new Component({
      propsData : props,
      mounted() {
        (this as any).destroyWhenClose = destroyWhenClose;
        getAppRoot().appendChild(this.$el);
      },
      beforeDestroy() {
        this.$el.remove();
      },
    }).$mount();
  }

  return {
    create,
  };
}
