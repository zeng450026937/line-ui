import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

function useComponentRoute(): RouteConfig[] {
  const readmes = require.context(
    'skyline/src/components/',
    true,
    /readme.md$/
  );
  const usages = require.context('skyline/src/components/', true, /usage.vue$/);

  return readmes.keys().map((path) => {
    const folder = path.split('/')[1];
    let readme;
    let usage;
    try {
      readme = readmes(path).default;
    } catch (error) {
      error;
    }
    try {
      usage = usages(path.replace('readme.md', 'usage.vue')).default;
    } catch (error) {
      error;
    }
    return {
      path: folder,
      name: folder,
      components: {
        readme,
        usage,
      },
    } as RouteConfig;
  });
}

export const components = useComponentRoute();
export const deviceComponents = useComponentRoute();

export const routes: RouteConfig[] = [
  {
    path: '/:component?',
    name: 'home',
    component: () => import('./home.vue'),
    children: components,
  },
  {
    path: '/mobile/home',
    name: 'mobile',
    component: () => import('./device/home.vue'),
    children: deviceComponents.map((component) => {
      component.path = `/mobile/home/${component.name}`;
      component.name = `device_${component.name}`;
      return component;
    }),
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    return to.hash ? { selector: to.hash } : { x: 0, y: 0 };
  },
});
