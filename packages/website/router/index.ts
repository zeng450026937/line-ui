import Vue from 'vue';
import VueRouter from 'vue-router';
import registerRoute from '../utils/router';
import { importAll } from '../utils';
import { navList } from '../utils/navigation.mobile';


const context = require.context('@/components/', true, /demo\/index.vue$/);
const docContext = require.context('@/components/', true, /readme.md$/);
const componentMap = importAll({}, context);
const docComponentMap = importAll({}, docContext);
const routeList = registerRoute({ list: navList, componentMap, isDemo: true });

const docRouteList = registerRoute({ list: navList, componentMap: docComponentMap, isDemo: false });

console.log('docRouteList', docRouteList);

Vue.use(VueRouter);

const routes = [
  {
    path      : '/website',
    name      : 'website',
    component : () => import('../views/Home.vue'),
    children  : [
      // {
      //   path      : '/website/button',
      //   name      : 'button',
      //   meta      : { displayDemo: true },
      //   component : () => import('../views/Button.vue'),
      // },
      ...docRouteList,
    ],
  },
  {
    path      : '/mobile-demo',
    name      : 'demo',
    component : () => import('../views/Device.vue'),
    children  : [...routeList],
  },
  {
    path : '/mobile-home',
    name : 'mobile',
    meta : {
      keepAlive : true,
    },
    component : () => import('../views/MobileHome.vue'),
  },
];

const router = new VueRouter({
  mode : 'history',
  base : process.env.BASE_URL,
  routes,
});


Object.assign(window, { router }); // router 对象注入 window

export default router;
