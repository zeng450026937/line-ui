import { VueConstructor } from 'vue';

const components = [] as Array<any>;

const install = (Vue: VueConstructor) => {
  components.forEach(Component => {
    Vue.use(Component);
  });
};

const version = process.env.VUE_APP_VERSION;

export default {
  install,
  version,
};
