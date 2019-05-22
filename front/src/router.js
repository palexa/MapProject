import Vue from 'vue';
import Router from 'vue-router';
import Authorization from './views/authorization/Authorization.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/authorization',
      name: 'authorization',
      component: Authorization,
    },
    {
      path: '/map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/map/Map.vue'),
    },
    {
      path: '/example',
      name: 'example',
      component: () => import(/* webpackChunkName: "about" */ './views/example.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import(/* webpackChunkName: "about" */ './views/registration/registration.vue'),
    },
  ],
});
