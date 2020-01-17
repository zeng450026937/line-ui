import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Home from './home.vue';
import Gallery from './gallery.vue';

Vue.use(Router);

function useComponentRoute(): RouteConfig[] {
  const readmes = require.context('@/components/', true, /readme.md$/);
  const usages = require.context('@/components/', true, /usage.vue$/);

  return readmes.keys().map(path => {
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
      path       : folder,
      name       : folder,
      components : {
        readme,
        usage,
      },
    } as RouteConfig;
  });
}

export const components = useComponentRoute();

export const routes: RouteConfig[] = [
  {
    path      : '/:component?',
    name      : 'home',
    component : Home,
    children  : components,
  },
];

export default new Router({
  mode : 'history',
  base : process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    return to.hash ? { selector: to.hash } : { x: 0, y: 0 };
  },
});
